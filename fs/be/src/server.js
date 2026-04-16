import 'dotenv/config';
import express from 'express';
import './databases/cron-db.js';
import morgan from 'morgan';
import cors from 'cors';
import ErrorHandler from './middlewares/error-handling.js';
import Routers from './routes.js';

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(Routers);
app.use(ErrorHandler);

app.use(cors());

app.use('/', (req, res)=>{
  res.json('hello world');
});

app.listen(process.env.PORT, ()=>{
  console.log(`server run at http://${process.env.HOST}:${process.env.PORT}`);
});