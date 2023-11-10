import { MovieModel } from "../model/mongoDB/movie.js";

export default class MovieController {
    static async getAllMovies(req, res) {
        try {
            const movies = await MovieModel.getAllMovies();
            res.status(200).json(movies);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getMovieById(req, res) {
        try {
            let id = req.params.id;
            const movie = await MovieModel.getMovieById(id);
            res.status(200).json(movie);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

}