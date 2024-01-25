import { Router } from "express";
import MovieController  from "../controllers/movies.js";


export const MoviesRouter = Router();


MoviesRouter.post('/addImage', MovieController.addImage);
MoviesRouter.get('/everything', MovieController.getAllMovies);
MoviesRouter.get('/all/:page', MovieController.getMovies);
MoviesRouter.get('/image/:path', MovieController.getImageExterna);
MoviesRouter.get('/findMovie/:id',MovieController.getMovieById);
MoviesRouter.get('/recomendationMovies/:user',MovieController.getRecomendationMovies);
