import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();


const url = process.env.MONGO_URI;
console.log(url);
console.log("tratando de conectar")
const client = new MongoClient(url);


async function connect() {
  try {
   
    await client.connect();
    console.log('Conexión exitosa a la base de datos.');
    const database = client.db(process.env.DB_NAME);
    return database.collection(process.env.DB_COLLECTION);
    
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    await client.close();
  }
}

export class MovieModel{
    static async getMovies(page){
        console.log("enviando page: " +page)
        const movies = await connect();
        //const lista= await movies.find({}).toArray();
        const lista = await movies.find({}).skip((page - 1) * 6).limit(6).toArray();

        const moviesParsed = lista.map(movie => {
          const fixedGenres = typeof movie.genres === 'string' ? movie.genres.replace(/'/g, '"') : null;
          const fixedProduction_Countries = typeof movie.production_countries === 'string' ? movie.production_countries.replace(/'/g, '"') : null;
          const fixedCollection = movie.belongs_to_collection==='string' ? movie.belongs_to_collection.replace(/'/g, '"') : null;
          //const fixedProduction = movie.production_companies ? movie.production_companies.replace(/'/g, '"') : null;
          const fixedLanguages = movie.spoken_languages==='string' ? movie.spoken_languages.replace(/'/g, '"') : null;
      
          //console.log(FormData(movie.release_date));
          return {
              ...movie,
              //genres: fixedGenres? JSON.parse(fixedGenres): null,
              //belongs_to_collection: fixedCollection? JSON.parse(fixedCollection): null,
              //production_countries: fixedProduction_Countries? JSON.parse(fixedProduction_Countries): null,
              //production_companies: fixedProduction? JSON.parse(fixedProduction): null,
              //spoken_languages: fixedLanguages? JSON.parse(fixedLanguages): null
          };
      });
  
      return moviesParsed;
      
        
        //console.log(lista)
        //const formattedMovies= lista.map((movie) => JSON.stringify(movie));

        //return formattedMovies;
    }

    static async addImage(image){
      const movies = await connect();
      const id = {
        id: parseInt(image.id)
      }
      

      const movieReplacement = {
        $set: { resource_image: image.resource_image }
      };
      const result = await movies.updateOne(id, movieReplacement, { returnDocument: 'after' });
  

      console.log(image.resource_image + "en model addimages")
      return result.value;
  }


    static async getMovieById(id){
        const movies = await connect();
        console.log("en model "+typeof(id))
        const movie = await movies.findOne({id: parseInt(id)});

        movie.genres = typeof movie.genres === 'string' ? JSON.parse(movie.genres.replace(/'/g, '"')) : null;
        movie.production_countries = typeof movie.production_countries === 'string' ? JSON.parse(movie.production_countries.replace(/'/g, '"')) : null;
        movie.belongs_to_collection = movie.belongs_to_collection === 'string' ? JSON(movie.belongs_to_collection.replace(/'/g, '"')) : null;
        //movie.production_companies = movie.production_companies ? movie.production_companies.replace(/'/g, '"') : null;
        movie.spoken_languages = movie.spoken_languages.length === 'string' ? JSON.parse(movie.spoken_languages.replace(/'/g, '"')) : null;   
        return movie
       
    }

    

    static async getAllMovies(){
      const movies = await connect()
      const lista= await movies.find({}).toArray();

      console.log(lista)

      const moviesParsed = lista.map(movie => {
        const fixedGenres = typeof movie.genres === 'string' ? movie.genres.replace(/'/g, '"') : null;
        const fixedProduction_Countries = typeof movie.production_countries === 'string' ? movie.production_countries.replace(/'/g, '"') : null;
        const fixedCollection = movie.belongs_to_collection==='string' ? movie.belongs_to_collection.replace(/'/g, '"') : null;
        const fixedLanguages = movie.spoken_languages==='string' ? movie.spoken_languages.replace(/'/g, '"') : null;
    
        return {
            ...movie,
    
        };
    });

    return moviesParsed;
  }
}