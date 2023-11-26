import Express, {json } from "express";
import { MoviesRouter } from "./routes/movies.js";
import cors from "cors";

const app = Express();

app.use(Express.static('public'))
app.use(json());
app.use(cors());

app.disable('x-powered-by');



app.use('/movies', MoviesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});