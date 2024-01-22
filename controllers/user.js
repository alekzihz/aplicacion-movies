import { UserModel } from "../model/mongoDB/user.js";
import bcrypt from 'bcrypt';

export default class UserController {
    static async addUser(req, res) {
        try {
            
            const {email,user,password} = req.body;
            let hashPassword  = async (password) => {
                const salt = await bcrypt.genSalt(10);
                return await bcrypt.hash(password, salt);
            }

            const newUser = await UserModel.addUser(email, user, await hashPassword(password));
            //es.status(200).json(newUser);
            res.redirect('/');

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

    static async login(req, res) {
        try {            
            const {email,password} = req.body;

            console.log(email,password)
            const user = await UserModel.getUser(email);
                               
            if (user) {                
                const match = await bcrypt.compare(password, user['contraseña']);
                if (match) {


                    req.session.user = {
                        mail: user.email,
                        logged: true,
                    };
                    res.redirect('/index.html');
                } else {
                    res.status(401).json({ message: 'Unauthorized' });
                }
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async session(req, res) {
        try {
            if (req.session.user) {
                res.status(200).json(req.session.user);
            } else {
                res.status(401).json({ message: 'Unauthorized' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async logout(req, res) {
        try {
            if (req.session.user) {

                //console.log("en looggut");
                req.session.destroy();
                //res.redirect('/index.html');
                res.status(200).json({ message: 'Logout success' });
            } else {
                res.status(401).json({ message: 'Unauthorized' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}