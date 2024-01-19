import { Router } from "express";
import UserController from "../controllers/user.js";


export const UserRouter = Router();


//UserRouter.post('/addUser',UserController.addUser);
UserRouter.post('/addUser',UserController.addUser)
UserRouter.get('/getUser/:email',UserController.getUser);
UserRouter.get('/allUsers',UserController.allUsers);
UserRouter.post('/login',UserController.login);
//UserRouter.get('/logout',UserController.logout);
//UserRouter.get('/getUser/:email',UserController.session);