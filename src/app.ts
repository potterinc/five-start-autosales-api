import express, { Application, Request, Response, NextFunction } from 'express';
import AppConfig from './config/app.config';
import cors from 'cors';
import helmet from 'helmet';
import { configDotenv } from 'dotenv';
import './config/app.server';

//Router Modules
import routerModule from './routes/index.route';
import morgan from 'morgan';

// Load environmental variables only when on development environment
if (process.env.NODE_ENV !== 'production')
    configDotenv();

// Initializing server application
const app: Application = express();

// Application
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: '["3.134.238.10","3.129.111.220","52.15.118.168"]' }));
app.use(helmet());
app.use(morgan('tiny'));

// Global error handler middleware
app.use((e: Error, req: Request, res: Response, next: NextFunction) => {
    if (e.name === 'SyntaxError')
      return res.status(400).json({
        success: false,
        message: e.message
      });
    return next(e.message)
  });

app.get('/', (req: Request, res: Response) => {
    res.redirect(`${AppConfig.SERVER.BASE_PATH}`);    
});

// Router
app.use(`${AppConfig.SERVER.BASE_PATH}`, routerModule)

export default app;