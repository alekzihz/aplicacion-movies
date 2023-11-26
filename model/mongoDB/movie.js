import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();


const url = process.env.MONGO_URI;
const client = new MongoClient(url);


async function connect() {
  try {
    await client.connect();
    //console.log('Conexión exitosa a la base de datos.');
    const database = client.db('appmovie');
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

        const moviesWithParsedGenres = lista.map(movie => {
          const fixedGenres = typeof movie.genres === 'string' ? movie.genres.replace(/'/g, '"') : null;
          

          //const fixedCollection = movie.belongs_to_collection === 'string' ? movies.belongs_to_collection.replace(/'/g, '"') : null;
          
          //console.log(fixedGenres)
          return {
              ...movie,
              genres: fixedGenres? JSON.parse(fixedGenres): null,
              //belongs_to_collection: fixedCollection? JSON.parse(fixedCollection): null
              //belongs_to_collection: JSON.parse(fixedCollection)
              // Agrega otras conversiones según sea necesario
          };
      });
  
      console.log(moviesWithParsedGenres);

      return moviesWithParsedGenres;
        
        //console.log(lista)
        //const formattedMovies= lista.map((movie) => JSON.stringify(movie));

        //return formattedMovies;
    }


    static async getMovieById(id){
        const movies = await connect();
        console.log("en model "+typeof(id))
        const movie = await movies.findOne({id: parseInt(id)});
        return movie
        const formattedMovie = JSON.stringify(movie);
        return formattedMovie;
    }
}