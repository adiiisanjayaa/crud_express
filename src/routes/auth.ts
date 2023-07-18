import { Router } from "express";
import AuthController from "../controller/AuthController";
import { checkJwt } from "../minddlewares/checkJwt";
// import AuthController from "./controllers/AuthController";
// import { checkJwt } from "../middlewares/checkJwt";

const router = Router();
//Login route
router.post("/login", AuthController.login);
//Register route
router.post("/register", AuthController.register);

//Change my password
router.post("/change-password", [checkJwt], AuthController.changePassword);

export default router;