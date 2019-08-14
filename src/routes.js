import { Router } from 'express';

import ProductController from './app/controllers/ProductController';
import AuthController from './app/controllers/AuthController';
import OrderController from './app/controllers/OrderController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.get('/', (req, res) => res.json({ message: 'Hello World!' }));
routes.post('/login', AuthController.store);
routes.get('/products', ProductController.index);

routes.use(authMiddleware);

routes.get('/orders', OrderController.index);
routes.post('/orders', OrderController.store);

export default routes;
