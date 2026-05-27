import cron from 'node-cron';
import DatabasePool from './database-pool.js';

const db =new DatabasePool;
cron.schedule('*/5 * * * *', async () => {
  try {
    await Promise.all([
      db.pool.query(`
        DELETE FROM verifikasi_email
        WHERE expired_at < NOW()
      `),

      db.pool.query(`
        DELETE FROM reset_password
        WHERE expired_at < NOW()
      `),
    ]);

    console.log('Cleanup success');
  } catch (err) {
    console.error('Cron cleanup error:', err);
  }
});