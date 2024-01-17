import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();
const url = process.env.MONGO_URI;
const client = new MongoClient(url);

async function connect() {
    try {
      await client.connect();
      const database = client.db(process.env.DB_NAME);
      return database.collection(process.env.DB_COLLECTION_USER);
      
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
      await client.close();
    }
  }

export class UserModel{
    static async addUser(email, user, contraseña){
            const users = await connect();
            
            const existingUser = await users.findOne({email: email});
            if(existingUser){
                throw new Error("Usuario ya existe");
            }
            const newUser = await users.insertOne({email: email, user: user, contraseña: contraseña});
            console.log(newUser)
            console.log("insertado")
            return newUser;
    }

    static async getUser(email){
        const users = await connect();
        const user = await users.findOne({email: email})
        console.log(user)
        return user;
    }

    static async allUsers(){
        const users = await connect();
        const lista = await users.find({}).toArray();
        return lista;
    }

}
  