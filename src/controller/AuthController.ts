import { AppDataSource } from "../data-source";
import { Request, Response } from "express"
import { User } from "../entity/User";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { validate } from "class-validator";

class AuthController {

    //login user
    static async login(req: Request, res: Response) {
        //Check if username and password are set
        let { username, password } = req.body;
        if (!(username && password)) {
            return res.status(400).send();
        }

        //Get user from database
        let user: User;
        try {
            let userRepository = AppDataSource.getRepository(User);
            user = await userRepository.findOneOrFail({ where: { username } });
        } catch (error) {
           return res.status(401).send();
        }

        //Check if encrypted password match
        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            res.status(400).send();
            return;
        }
    
        //sign JWT, valid for 1 hour
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            config.jwtSecret,
            { expiresIn: "1h" }
        );

        //Send the jwt in the response
        return res.send(token);
    }

    //register user
    static async register(req: Request, res: Response) {
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
        return res.status(201).send("User created");
    }

    static async changePassword(req: Request, res: Response){
        //Get ID from JWT
        const id = res.locals.jwtPayload.userId;
        let userRepository = AppDataSource.getRepository(User);

        //Get parameters from the body
        const { oldPassword, newPassword } = req.body;
        if (!(oldPassword && newPassword)) {
            res.status(400).send();
        }

        //Get user from the database
        let user: User;
        try {
            
            user = await userRepository.findOneOrFail({
                where:{id}
            });
        } catch (id) {
            res.status(401).send();
        }

        //Check if old password matchs
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            res.status(401).send();
            return;
        }

        //Validate de model (password lenght)
        user.password = newPassword;
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        //Hash the new password and save
        user.hashPassword();
        userRepository.save(user);

        res.status(204).send();
    }
}

export default AuthController;