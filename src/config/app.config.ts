import { configDotenv } from 'dotenv';


// Load environmental variables only when on development environment
if (process.env.NODE_ENV !== 'production')
    configDotenv();

/**
 * Global app configuration options
 */
const AppConfig = {
    DB: {
        DATABASE_URI: String(process.env.DATABASE_URI)
        // DATABASE_URI:'mongodb://localhost:27017/FiveStarAuto',
    },
    SERVER:{
        PORT: process.env.PORT || 5100,
        BASE_PATH: process.env.BASE_PATH
    },
    SMS:{
        TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN:process.env.TWILIO_AUTH_TOKEN,
        TWILIO_SENDER: process.env.TWILIO_SENDER
    },
    JWT_TOKEN: String(process.env.JWT_TOKEN)
}

export default AppConfig;