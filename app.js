import Express, {json } from "express";
import { MoviesRouter } from "./routes/movies.js";
import { corsMiddleware } from "./middleware/cors.js";

const app = Express();

app.use(json());
app.use(corsMiddleware());

app.use(Express.static('public'))
app.disable('x-powered-by');



app.use('/movies', MoviesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});