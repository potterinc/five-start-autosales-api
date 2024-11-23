import express, { Router } from 'express';
import Product from '../services/product.service';
import Guard from '../middlewares/authentication.middleware';

// @Injectables
const productRoute: Router = express.Router();
const product = new Product();
const guard = new Guard();

productRoute
  .route('/')

  // list product
  .get(product.list)

  // add product
  .post(guard.VERIFY_AUTH_TOKEN, product.create)


productRoute
  .route('/:id')

  // View product
  .get(product.view)

  // Delete product
  .delete(guard.VERIFY_AUTH_TOKEN, product.remove)

  // Update product
  .patch(guard.VERIFY_AUTH_TOKEN, product.update);

export default productRoute;