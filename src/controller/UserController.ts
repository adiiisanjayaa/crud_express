import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import { validate } from "class-validator";

export class UserController {

    //get all users
    static async all(req: Request, res: Response, next: NextFunction) {
        let userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find({
            select: ["id", "username", "role"] //We dont want to send the passwords on response
        });
    
        //Send the users object
        res.send(users);
    }

    //get user by id
    static async getOneById(req: Request, res: Response, next: NextFunction) {
        //Get the ID from the url
        const id: number = req.params.id;

       try {
        let userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneOrFail({
            where:{id},
            select: ["id", "username", "role"] //We dont want to send the password on response
        });
        res.send(user);
        } catch (error) {
        res.status(404).send("User not found");
        }
    }

    //save user
    static async save(req: Request, res: Response, next: NextFunction) {
        //Get parameters from the body
        let { username, password, role } = req.body;
        let user = new User();
        user.username = username;
        user.password = password;
        user.role = role;

        //Validade if the parameters are ok
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //Hash the password, to securely store on DB
        user.hashPassword();

        //Try to save. If fails, the username is already 
        try {
            let userRepository = AppDataSource.getRepository(User);
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send("Username already in use");
            return;
        }

        //If all ok, send 201 response
        res.status(201).send("User created");
    }

    //update user
    static async update(req: Request, res: Response, next: NextFunction) {
        //Get the ID from the url
        const id = req.params.id;

        //Get values from the body
        const { username, role } = req.body;

        //Try to find user on database
        let user;
        try {
            let userRepository = AppDataSource.getRepository(User);
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).send("User not found");
            return;
        }

        //Validate the new values on model
        user.username = username;
        user.role = role;
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //Try to safe, if fails, that means username already in use
        try {
            let userRepository = AppDataSource.getRepository(User);
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send("username already in use");
            return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
    }

    //remove user by id
    static async remove(req: Request, res: Response, next: NextFunction) {
        //Get the ID from the url
        const id = req.params.id;
        let userRepository = AppDataSource.getRepository(User);

        let user: User;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send("User not found");
            return;
        }
        userRepository.delete(id);

        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
    }

}