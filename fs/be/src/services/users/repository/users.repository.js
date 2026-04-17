
import DatabasePool from '../../../databases/database-pool.js';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';

export class UsersRepository extends DatabasePool {
  async createUser({ email, fullname, password, googleID }) {
    if (password) password = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users (id,email,password,fullname,google_id) VALUES ($1,$2,$3,$4,$5) RETURNING id,email',
      values: [`user-${nanoid()}`, email, password, fullname, googleID]
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }
  async verifyNewEmail(email) {

    const query = {
      text: 'SELECT email FROM users WHERE email = $1',
      values: [email]
    };

    const result = await this.pool.query(query);

    return result.rows.length > 0;
  }

  async updateVerifiedEmail(userID) {
    const query = {
      text: 'UPDATE users SET verified_email = $1 WHERE id = $2',
      values: [true, userID]
    };

    const result = await this.pool.query(query);

    return result.rowCount > 0;
  }
  async findUser(id){
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id]
    };
    const result = await this.pool.query(query);
    return result.rows[0];
  }

}
export default UsersRepository;
