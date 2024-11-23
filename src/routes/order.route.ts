import express, { Router } from 'express';
import OrderService from '../services/order.service';
import Guard from '../middlewares/authentication.middleware';
import OrderController from '../controllers/order.controller';

// @Injectables
const orderRoute: Router = express.Router();
const order = new OrderController();
const authorize = new Guard();

orderRoute
  .route('/')

  //Place an order
  .post(authorize.VERIFY_AUTH_TOKEN, order.placeOrder)

  // Order History
  // .get(authorize.VERIFY_AUTH_TOKEN, order.)

export default orderRoute;