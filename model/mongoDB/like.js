import { MongoClient } from 'mongodb';
import { UserModel } from '../mongoDB/user.js';
import { MovieModel } from '../mongoDB/movie.js';


import dotenv from 'dotenv';

dotenv.config();


const url = process.env.MONGO_URI;
//console.log(url);
const client = new MongoClient(url);

async function connect() {
    try {
      await client.connect();
      const database = client.db(process.env.DB_NAME);
      return database.collection(process.env.DB_COLLECTION_LIKE);
      
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
      await client.close();
    }
  }

  export class LikeModel{

    static async addLike(movie,email){
        const likes = await connect();

        const date = new Date();
        const existingUser = await UserModel.getUser(email);
        const existingMovie = await MovieModel.getMovieById(movie);

        if (!existingUser){
            throw new Error("Usuario no existe");
        }
        if (!existingMovie){
            throw new Error("Pelicula no existe");
        }      
        const newLike = await likes.insertOne({movie: movie, user: email, date: date});
        return newLike;
    }

    static async getLikesByUser(user){
        const likes = await connect();
        const lista = await likes.find({user: user}).toArray();
        return lista;
    }

    static async deleteLike(movie, userEmail){
        const likes = await connect();
        const deletedLike = await likes.deleteOne({user: userEmail, movie: movie});
        return deletedLike;
    }

    static async likesUser(myMovie,userEmail){
       
        const likes = await connect();
        const lista = await likes.findOne({user: userEmail, movie: myMovie})
        return lista ?  true :  false;
    }
  

}