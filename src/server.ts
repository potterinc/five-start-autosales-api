import app from "./app";
import AppConfig from "./config/app.config";

// Starting server
app.listen(AppConfig.SERVER.PORT, () => console.log('info',`API service running on ${AppConfig.SERVER.PORT}`));