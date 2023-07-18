import "reflect-metadata";
import * as express from "express"
import * as bodyParser from "body-parser"
import * as morgan from "morgan"
import * as cors from "cors";
import helmet from "helmet";
import routes from "./routes";
// import { Request, Response } from "express"
// import { Routes } from "./routes/routes"
// import { validationResult } from "express-validator"

// Create a new express application instance
const app = express();

// Call midlewares
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

//morgan to logger
app.use(morgan('tiny'))

//handle error
function handleError(err, req, res, next){
    res.status(err.statusCode || 500).send({message:err.message});
}

//use handle error
app.use(handleError);

//Set all routes from routes folder
app.use("/", routes);

// //register express routes from defined application routes
// Routes.forEach(route => {
//     (app as any)[route.method](route.route,
//         //call route validation
//         ...route.validation,
//         async (req: Request, res: Response, next: Function) => {
//         try {
//             //get validation result
//             const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//                 // return error
//                 return res.status(400).json({error:errors.array()});
//             }
//             //return result
//             const result = await (new (route.controller as any))[route.action](req, res, next)
//             res.json(result)
//         } catch (error) {
//             next(error);
//         }
//     })
// })

export default app;
