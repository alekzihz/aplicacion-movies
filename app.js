
import express, {json } from "express";

const app = express();

app.use(json());

const PORT = process.env.PORT || 3000;

app.use('/', (req, res) => {
    res.status(200).json({
        message: "test endpoint"
    });
});



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});