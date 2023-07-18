import { AppDataSource } from "./data-source"
import config from "./config/config";
import app from "./app"

AppDataSource.initialize().then(async () => {
    // start express server
    app.listen(config.port)
    console.log(`Express server has started on port ${config.port}.`)
}).catch(error => console.log(error))
