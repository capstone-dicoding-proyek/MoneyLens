import express from 'express';
import routerUser from './services/users/routes/users.routes.js';
import routerAuthentication from './services/authentications/routes/authentications.routes.js';
const Routers = express.Router();

Routers.use(routerUser);
Routers.use(routerAuthentication);
export default Routers;