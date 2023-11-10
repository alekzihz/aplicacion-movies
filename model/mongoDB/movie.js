import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();


const url = process.env.MONGO_URI;
const client = new MongoClient(url);


async function connect() {
  try {
    await client.connect();
    //console.log('Conexión exitosa a la base de datos.');
    const database = client.db('moviedb');
    return database.collection('moviedb');
    
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    await client.close();
  }
}

export class MovieModel{
    static async getAllMovies(){
        const movies = await connect();
        const lista= await movies.find({}).limit(100).toArray();
        const formattedMovies= lista.map((movie) => JSON.stringify(movie)).join('\n');

        return formattedMovies;
    }


    static async getMovieById(id){
        const movies = await connect();
        console.log("en model "+typeof(id))
        const movie = await movies.findOne({id: parseInt(id)});
        const formattedMovie = JSON.stringify(movie);
        return formattedMovie;
    }
}