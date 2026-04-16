import express from 'express';
import routerUser from './services/users/routes/users.routes.js';
const Routers = express.Router();

Routers.use(routerUser);
export default Routers;