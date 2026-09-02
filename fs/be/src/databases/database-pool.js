import 'dotenv/config';
import { Pool } from 'pg';

class DatabasePool {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
}
export default DatabasePool;