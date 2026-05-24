import 'dotenv/config';
import { OAuth2Client } from 'google-auth-library';
import DatabasePool from './databases/database-pool.js';
import CacheService from './databases/redis-client.js';
import AuthenticationsRepository from './services/authentications/repository/authentications.repository.js';
import UsersRepository from './services/users/repository/users.repository.js';
import MailSender from './utils/mail-sender.js';
import TransactionsRepository from './services/transactions/repository/transactions.repository.js';

export const databasesClient = new DatabasePool();
export const redisClient = new CacheService();
export const authenticationsRepository = new AuthenticationsRepository(databasesClient, redisClient);
export const usersRepository = new UsersRepository(databasesClient);
export const transactionsRepository = new TransactionsRepository(databasesClient, redisClient);
export const mailSender = new MailSender();

export const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.URLFE
);