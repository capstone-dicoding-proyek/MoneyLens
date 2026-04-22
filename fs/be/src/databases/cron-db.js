import cron from 'node-cron';
import DatabasePool from './database-pool.js';

const db =new DatabasePool;
cron.schedule('*/5 * * * *', async () => {
  await db.pool.query(`
    DELETE FROM verifikasi_email
    WHERE "expired_at" < NOW()
  `);
});

cron.schedule('*/5 * * * *', async () => {
  await db.pool.query(`
    DELETE FROM reset_password
    WHERE "expired_at" < NOW()
  `);
});


cron.schedule('*/5 * * * *', async () => {
  await db.pool.query(`
      DELETE FROM authentications
      WHERE expired_at < NOW()
      RETURNING id
    `);

});