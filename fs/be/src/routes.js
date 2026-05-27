import express from 'express';
import routerUser from './services/users/routes/users.routes.js';
import routerAuthentication from './services/authentications/routes/authentications.routes.js';
import routerTransactions from './services/transactions/routes/transactions.routes.js';
import routerOcr from './services/ocr/routes/ocr.routes.js';

const Routers = express.Router();

Routers.use(routerUser);
Routers.use(routerAuthentication);
Routers.use(routerTransactions);
Routers.use(routerOcr);

export default Routers;