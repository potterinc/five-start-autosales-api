import { Request, Response } from 'express';
import IOrders from '../interfaces/order.interface';
import IUser from '../interfaces/user.interface';
import { ErrorResponseHandler } from '../utils/errors.utils';
import OrderService from '../services/order.service';

class OrderController {
  
  /**@description Place an order */
  async placeOrder(req: Request, res: Response) {
    const authorizedUser = res.locals.payload._id;
    const { }: IOrders = req.body;
    
    const orderServices = new OrderService({
      user: authorizedUser,
      ...req.body
    });
    
    try {
      await orderServices.placeOrder()
        .then(order => {
          return res.status(200).json({
            status: true,
            message: 'Order has been placed'
          })
        })
    }
    catch (e: unknown | any) {
      new ErrorResponseHandler(e, res);
    }
  }
}

export default OrderController;