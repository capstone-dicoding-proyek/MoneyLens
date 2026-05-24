import './env.js';
import express from 'express';
import './databases/cron-db.js';
import morgan from 'morgan';
import cors from 'cors';
import ErrorHandler from './middlewares/error-handling.js';
import Routers from './routes.js';
import './container.js';


export const app = express();
app.use(cors({
  origin: process.env.URLFE,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use('/api', Routers);
app.use(ErrorHandler);



app.listen(process.env.PORT, process.env.HOST, ()=>{
  console.log(`server run at http://${process.env.HOST}:${process.env.PORT}`);
});