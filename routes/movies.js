import { Router } from "express";
import MovieController  from "../controllers/movies.js";


export const MoviesRouter = Router();


MoviesRouter.get('/all/:page', MovieController.getMovies);
MoviesRouter.get('/:id', MovieController.getMovieById);
MoviesRouter.get('/image/:path', MovieController.getImageExterna);
