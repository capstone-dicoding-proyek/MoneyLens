import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import ErrorHandler from './middlewares/error-handling';
import Routers from './routes';

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