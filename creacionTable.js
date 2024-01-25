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
      const database = client.db(process.env.DB_NAME);
      return database.collection(process.env.DB_COLLECTION_LIKE);
      
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
      await client.close();
    }
  }

  const likes = await connect();
  console.log(likes.dbName.collection)