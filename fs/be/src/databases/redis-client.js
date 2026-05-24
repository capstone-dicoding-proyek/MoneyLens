import 'dotenv/config';
import { createClient } from 'redis';
class CacheService {
  constructor() {
    console.log(process.env.REDIS_PASSWORD || undefined);
    this._client = createClient({
      username: 'default',
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT || 6379,
      },
      password: process.env.REDIS_PASSWORD || undefined,
    });

    this._client.on('error', (error) => {
      console.error('Redis error:', error);
    });

    this._client.connect().catch(console.error);
  }

  async set(key, value, expirationInSecond = 300) {
    await this._client.set(key, JSON.stringify(value), {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    const result = await this._client.get(key);
    if (result === null) return null;
    return JSON.parse(result);
  }

  async delete(key) {
    return this._client.del(key);
  }

  async deleteByPattern(pattern) {

    const keys = await this._client.keys(pattern);
    if (keys.length > 0) {
      await this._client.del(keys);
    }
  }

  async invalidateUser(userID) {
    await this.deleteByPattern(`*:${userID}:*`);
    await this.delete(`years:${userID}`);
  }
}

export default CacheService;