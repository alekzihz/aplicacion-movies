import { UserModel } from "../model/mongoDB/user.js";
import bcrypt from 'bcrypt';

export default class UserController {
    static async addUser(req, res) {
        try {
            const email = req.params.email;
            const user = req.params.user;
            const password = req.params.password;
            //const {email,user,password} = req.body;

         

            let hashPassword  = async (password) => {
                const salt = await bcrypt.genSalt(10);
                return await bcrypt.hash(password, salt);
            }

            const newUser = await UserModel.addUser(email, user, await hashPassword(password));
            res.status(200).json(newUser);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getUser(req, res) {
        try {
            const email = req.params.email;
            const user = await UserModel.getUser(email);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
    static async allUsers(req, res) {
        try {
            const users = await UserModel.allUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}