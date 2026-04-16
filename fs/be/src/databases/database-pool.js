import 'dotenv/config';
import { Pool } from 'pg';

class DatabasePool {
  constructor() {
    this.pool = new Pool({
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      port: process.env.PGPORT,
    });
  }
}
export default DatabasePool;