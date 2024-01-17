import { MovieModel } from "../model/mongoDB/movie.js";

export default class MovieController {
    static async getMovies(req, res) {
        try {
            const page = req.params.page;
            const movies = await MovieModel.getMovies(page);
            res.status(200).json(movies);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async addImage(req, res) {
        try {
            //console.log("hola")
            //return
            const image = req.body;
            console.log("en controller addimage")
            console.log(image)
            const movie = await MovieModel.addImage(image);
            res.status(200).json(movie);
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

   

    static async getAllMovies(req, res) {
        try {
           
            const movies = await MovieModel.getAllMovies();
            res.status(200).json(movies);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getImageExterna(req, res) {
        try {
            let path = req.params.path;
            const tmdbUrl = `https://image.tmdb.org/t/p/w500/${path}`;
            const filmtoroUrl = `https://filmtoro.cz/img/film/${path}`;
            const response = await fetch(tmdbUrl);
            const image = await response.blob();
            if (response.ok) {
                res.setHeader('Content-Type', 'image/jpeg'); // Ajusta el tipo de contenido según tu caso
                return res.send(Buffer.from(await image.arrayBuffer()));
            } else {
                const response = await fetch(filmtoroUrl);
                const image = await response.blob();
                res.setHeader('Content-Type', 'image/jpeg'); // Ajusta el tipo de contenido según tu caso
                return res.send(Buffer.from(await image.arrayBuffer()));
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

}