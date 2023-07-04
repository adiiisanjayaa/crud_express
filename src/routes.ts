import { body, param } from "express-validator"
import { UserController } from "./controller/UserController"

export const Routes = [{
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all",
    validation:[],
}, {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one",
    validation:[
        param('id').isInt(),
    ],
}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save",
    validation:[
        body('name').isString(),
        body('email').isString(),
    ],
}, {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove",
    validation:[
        param('id').isInt(),
    ],
}, {
    method: "put",
    route: "/users/:id",
    controller: UserController,
    action: "update",
    validation:[
        param('id').isInt(),
        body('name').isString(),
        body('email').isString(),
    ],
},]