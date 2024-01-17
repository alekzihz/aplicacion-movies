import Express, {json } from "express";
import { MoviesRouter } from "./routes/movies.js";
import { corsMiddleware } from "./middleware/cors.js";
import { UserRouter } from "./routes/users.js";
import bodyParser  from "body-parser";



const app = Express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(json());
app.use(corsMiddleware());

app.use(Express.static('public'))
app.disable('x-powered-by');



app.use('/movies', MoviesRouter);
app.use('/users', UserRouter);
app.use('/login', Express.static('public/login.html'));
app.use('/es-spain', Express.static('public/registrar.html'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});