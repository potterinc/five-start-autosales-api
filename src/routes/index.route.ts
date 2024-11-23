import { Router, Request, Response } from 'express';
import UserProfile from '../services/user.service';
import AppConfig from '../config/app.config';
import userRoute from './user.route';
import productRoute from './product.route';
import orderRoute from './order.route';

const user = new UserProfile;
const routerModule: Router = Router();

/**API base route */
routerModule.get('', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Welcome to the five-start autosales eCommerce API<br>ensure you read the API docs before you continue' });
});

// Routes
routerModule.post('/login', user.login); // User login
routerModule.get('/transactions'); // Transaction history
routerModule.use('/user', userRoute);
routerModule.use('/product', productRoute);
routerModule.use('/orders', orderRoute);

export default routerModule;