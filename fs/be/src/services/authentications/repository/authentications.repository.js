
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import { InvariantError } from '../../../exceptions/error.js';

export class AuthenticationsRepository {
  constructor(
    databasePool,
    cacheService
  ) {
    this.client = databasePool;
    this.cache = cacheService;
  }
  async createVerifyTokenEmail(id) {
    const token = `token-user-${nanoid()}`;
    const query = {
      text: 'INSERT INTO verifikasi_email (id, user_id, token) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET token = EXCLUDED.token RETURNING token',
      values: [`verif-${nanoid()}`, id, token]
    };

    const result = await this.client.pool.query(query);
    return result.rows[0].token;
  }

  async deleteVerifyTokenEmail(token) {
    const query = {
      text: 'DELETE FROM verifikasi_email WHERE token = $1',
      values: [token]
    };
    await this.client.pool.query(query);
  }


  async verifyEmailTokenCredential(token) {

    const query = {
      text: 'SELECT user_id FROM verifikasi_email WHERE token = $1 AND "expired_at" > NOW()',
      values: [token]
    };
    const result = await this.client.pool.query(query);
    console.log(result.rows[0]);
    if (!result.rowCount) {
      throw new InvariantError('Token tidak valid atau expired');
    }

    return result.rows[0].user_id;

  }

  async verifyUserCredential({ email, password }) {

    const query = {
      text: 'SELECT id,password FROM users WHERE email = $1',
      values: [email]
    };
    const result = await this.client.pool.query(query);
    const user = result.rows[0];
    if (!user) return null;
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return null;
    return user;
  }

  async addRefreshToken({ userID, token }) {
    await this.cache.set(`rt:${token}`, userID, 60 * 60 * 24 * 7);
  }

  async deleteRefreshToken(token) {
    await this.cache.delete(`rt:${token}`);
  }

  async verifyRefreshToken(token) {
    const cached = await this.cache._client.get(`rt:${token}`);
    if (!cached) return false;
    return { token };
  }

  async createResetTokenPassword(id) {
    const token = `token-reset-password-user-${nanoid()}`;
    const query = {
      text: 'INSERT INTO reset_password (id, user_id, token) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET token = EXCLUDED.token RETURNING token',
      values: [`verif-${nanoid()}`, id, token]
    };

    const result = await this.client.pool.query(query);
    return result.rows[0].token;
  }

  async deleteResetTokenPassword(token) {
    const query = {
      text: 'DELETE FROM reset_password WHERE token = $1',
      values: [token]
    };
    await this.client.pool.query(query);
  }


  async verifyResetTokenCredentialPassword(token) {

    const query = {
      text: 'SELECT user_id FROM reset_password WHERE token = $1 AND "expired_at" > NOW()',
      values: [token]
    };
    const result = await this.client.pool.query(query);
    console.log(result.rows[0]);
    if (!result.rowCount) {
      throw new InvariantError('Token tidak valid atau expired');
    }

    return result.rows[0].user_id;

  }

}
export default AuthenticationsRepository;
