import './env.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import './databases/cron-db.js';
import morgan from 'morgan';
import cors from 'cors';
import ErrorHandler from './middlewares/error-handling.js';
import Routers from './routes.js';
import './container.js';
import helmet from 'helmet';


const app = express();

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}
app.use(cookieParser());
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

const allowedOrigins = [
  process.env.URLFE,
  'https://money-lens-id.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/$/, '');
    const isAllowed = allowedOrigins.some((allowed) => (
      allowed.replace(/\/$/, '') === normalizedOrigin
    ));

    if (isAllowed) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
}));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use(express.json());
app.use('/api', Routers);
app.use(ErrorHandler);


if (process.env.NODE_ENV !== 'production') {
  app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`server run at http://${process.env.HOST}:${process.env.PORT}`);
  });
}

export { app };
export default app;