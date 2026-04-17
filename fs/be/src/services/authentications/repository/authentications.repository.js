
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import DatabasePool from '../../../databases/database-pool.js';
import { InvariantError } from '../../../exceptions/error.js';

export class AuthenticationsRepository extends DatabasePool {
  async createVerifyTokenEmail(id) {
    const token = `token-user-${nanoid()}`;
    const query = {
      text:  'INSERT INTO verifikasi_email (id, user_id, token) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET token = EXCLUDED.token RETURNING token',
      values: [`verif-${nanoid()}`, id, token]
    };

    const result = await this.pool.query(query);
    return result.rows[0].token;
  }

  async deleteVerifyTokenEmail(token) {
    const query = {
      text: 'DELETE FROM verifikasi_email WHERE token = $1',
      values: [token]
    };
    await this.pool.query(query);
  }


  async verifyEmailTokenCredential(token) {

    const query = {
      text: 'SELECT user_id FROM verifikasi_email WHERE token = $1 AND "expired_at" > NOW()',
      values: [token]
    };
    const result = await this.pool.query(query);
    console.log(result.rows[0]);
    if (!result.rowCount) {
      throw new InvariantError('Token tidak valid atau expired');
    }

    return result.rows[0].user_id;

  }

  async verifyUserCredential({ username, password }) {

    const query = {
      text: 'SELECT id,password FROM users WHERE username = $1',
      values: [username]
    };
    const result = await this.pool.query(query);
    const user = result.rows[0];
    if (!user) return null;
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return null;
    return user;
  }

  async addRefreshToken({ userID, token }) {
    const query = {
      text: 'INSERT INTO authentications (id, user_id, token) VALUES($1,$2,$3)',
      values: [`rt-${nanoid()}`, userID, token],
    };

    await this.pool.query(query);
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };
    await this.pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1  AND expired_at > NOW() ',
      values: [token],
    };

    const result = await this.pool.query(query);
    if (!result.rows.length) {
      return false;
    }

    return result.rows[0];
  }
}
export default AuthenticationsRepository;
