import { LikeModel } from "../model/mongoDB/like.js";

export default class LikeController {

    static async addLike(req, res) {
        try {

            console.log("en controlador like")
            const { movie, userMail } = req.body;    
            const newLike = await LikeModel.addLike(movie,userMail);

            
            res.status(200).json(newLike);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    
    }

    static async deleteLike(req, res){
        try {
            const { movie, userMail } = req.body;
            const like = await LikeModel.deleteLike(movie,userMail);
            res.status(200).json(like);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async likesUser(req, res){
        try {

            const { movie, userMail } = req.body;
                console.log("en controlador likesUser");
                const likes = await LikeModel.likesUser(movie,userMail);
                res.status(200).json(likes);
            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

}