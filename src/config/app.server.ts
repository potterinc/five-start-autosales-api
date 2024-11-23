import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
import AppConfig from './app.config';


// Load environmental variables only when on development environment
if (process.env.NODE_ENV !== 'production')
    configDotenv();

// Connecting to database
const dbConnection = mongoose.connect(AppConfig.DB.DATABASE_URI, {
    retryWrites: true,
    w: 'majority'
})
    .then(() => console.log(`DATASOURCE:${mongoose.connection.host}\nPORT: ${mongoose.connection.port}\nDATABASE:${mongoose.connection.name}`))
    .catch(error => console.log(error));

export default dbConnection;