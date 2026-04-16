import cron from 'node-cron';
import DatabasePool from './database-pool.js';

const db =new DatabasePool;
cron.schedule('*/5 * * * *', async () => {
  await db.pool.query(`
    DELETE FROM verifikasi_email
    WHERE "expiredAt" < NOW()
  `);
});