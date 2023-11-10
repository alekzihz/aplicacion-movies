import Express, {json } from "express";
import { MoviesRouter } from "./routes/movies.js";

const app = Express();

app.use(json());
app.disable('x-powered-by');



app.use('/movies', MoviesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});