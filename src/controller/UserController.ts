import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"

export class UserController {

    private userRepository = AppDataSource.getRepository(User)

    //get all users
    async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find()
    }

    //get user by id
    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)
        const user = await this.userRepository. findOne({
            where: { id }
        })

        if (!user) {
            throw Error("unregistered user")
        }
        return user
    }

    //save user
    async save(request: Request, response: Response, next: NextFunction) {
        const { name, email } = request.body;
        const user = Object.assign(new User(), {
            name,
            email
        })

        return this.userRepository.save(user)
    }

    //update user
    async update(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)
        const { name, email } = request.body;
        const data = Object.assign(new User(), {
            name,
            email
        })

        const user = await this.userRepository.update(id, data)
        if (!user) {
            throw Error("unregistered user")
        }
        return user
    }

    //remove user by id
    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)
        const userToRemove = await this.userRepository.findOneBy({ id })

        if (!userToRemove) {
            throw Error("This user not exist")
        }

        await this.userRepository.remove(userToRemove)
        return "User has been removed"
    }

}