import { Router } from "express";
import LikeController  from "../controllers/like.js";


export const LikeRouter = Router();

LikeRouter.post('/addLike', LikeController.addLike);
LikeRouter.post('/movieUser', LikeController.likesUser);
LikeRouter.delete('/removeLike/', LikeController.deleteLike);

