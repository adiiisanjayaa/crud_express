import { Request, Response, NextFunction } from "express";

import { User } from "../entity/User";
import { AppDataSource } from "../data-source";

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Get the user ID from previous midleware
    const id = res.locals.jwtPayload.userId;

    //Get user role from the database
    const userRepository = AppDataSource.getRepository(User);
    let user: User;
    try {
        console.log(id);
        user = await userRepository.findOneOrFail({
            where:{id}
        });
    } catch (id) {
        console.log('error check user on check role', id);
        return res.status(401).send();
    }

    //Check if array of authorized roles includes the user's role
    console.log(roles);
    console.log(user.role);
    console.log(roles.indexOf(user.role) );
    if (roles.indexOf(user.role) > -1) next();
    else res.status(401).send();
  };
};
