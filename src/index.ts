import { AppDataSource } from "./data-source"
import { port } from "./config"
import app from "./app"

AppDataSource.initialize().then(async () => {
    // start express server
    app.listen(port)
    console.log(`Express server has started on port ${port}.`)
}).catch(error => console.log(error))
