import { Router } from "express";
import { checkJwt } from "../minddlewares/checkJwt";
import { checkRole } from "../minddlewares/checkRole";
import { UserController } from "../controller/UserController";

  const router = Router();

  //Get all users
  router.get("/", [checkJwt, checkRole(["admin"])], UserController.all);

  // Get one user
  router.get(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN"])],
    UserController.getOneById
  );

  //Create a new user
  router.post("/", [checkJwt, checkRole(["ADMIN"])], UserController.save);

  //Edit one user
  router.patch(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN"])],
    UserController.update
  );

  //Delete one user
  router.delete(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN"])],
    UserController.remove
  );

  export default router;