import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import tf from '@tensorflow/tfjs';
import { LikeModel } from './like.js';
import { ReadJson } from './read.js';
//import {svd} from 'svd-js';
import { SVD } from 'svd-js'
import {spawn} from 'child_process';
import { Model } from 'mongoose';




dotenv.config();


const url = process.env.MONGO_URI;
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

        //console.log(session.user)
        const movies = await connect();
        //console.log("en model "+typeof(id))
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

  static async getRecomendationMoviesTensor(user){
    try{
      //const Movies = await ReadJson.getData(); //todas las peliculas
      const [Movies, Generos] = await ReadJson.getData(); //todas las peliculas y generos
      const UserMovies = await LikeModel.getLikesByUser(user); //peliculas que le gustan al usuario

      const idMovies = UserMovies.map(movie => movie.movie); //id de las peliculas que le gustan al usuario
     
      const myGenres = new Set();
      UserMovies.map(movie => {
        const movieId = movie.movie;

        Movies.forEach((movie,index)=>{
          if(movie.id===movieId){
            movie.genres = typeof movie.genres === 'string' ? JSON.parse(movie.genres.replace(/'/g, '"')) : movie.genres;
            movie.genres.forEach(genre => myGenres.add(genre.name));
          }
        })
      }); //generos de las peliculas que le gustan al usuario
      
      //console.log(myGenres);
  
      //console.log(Generos)
    
      const mapMovie = new Map();
      UserMovies.forEach((movie,index)=>{
        const movieId = movie.movie;
        if(!mapMovie.has(movieId)){
          mapMovie.set(movieId,mapMovie.size);
        }
      })

    

      const userData = new Array(Movies.length).fill(0);
      UserMovies.forEach((movie,index)=>{
        const movieId = movie.movie;
        const movieIndex = mapMovie.get(movieId);
        userData[movieIndex]=1;
      })


      const numGenres = Generos.length;
      const oneHotVector = new Array(numGenres).fill(0); // Inicializa un vector de ceros
      
      const movieGenres = Array.from(myGenres); //género de las peliculas de un usuario

      // Establece en 1 las posiciones correspondientes a los géneros de la película
      movieGenres.forEach(genre => {
        const index = Generos.indexOf(genre);
        if (index !== -1) {
          oneHotVector[index] = 1;
        }
      });

      console.log(oneHotVector)

      //oneHotVector mis caracteristicas a buscar
      //generos a buscar

      const modeloRecomendacion = tf.sequential();

      modeloRecomendacion.add(tf.layers.dense({units: 64, inputShape: [userData.length + oneHotVector.length]}));
      modeloRecomendacion.add(tf.layers.dense({units: 32, activation: 'relu'}));
      modeloRecomendacion.add(tf.layers.dense({units: 1, activation: 'sigmoid'})); // Salida binaria (like/no like)

    // Compilar el modelo
    modeloRecomendacion.compile({optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy']});

    const caracteristicas = [...userData, ...oneHotVector];
    const predic = modeloRecomendacion.predict(tf.tensor([caracteristicas]));
    console.log(predic.length)

    for (let i = 0; i < predic.length; i++) {
      const prediction = predic[i][0]; 
      // Determinar si la película es recomendada o no basada en la predicción
      const recommendation = prediction > 0.5 ? 'Recomendada' : 'No recomendada';
      
      console.log(`Película ${i + 1}: Predicción de que le gusta al usuario: ${prediction.toFixed(4)} (${recommendation})`);
    }


// Visualizar la arquitectura del modelo
  //modeloRecomendacion.summary();
      
    



     






    
    

    

    return true;

    }
    catch{
      console.log("Error modelo de aprendizaje")
    }

    

   
  }

  static async getRecomendationMovies(user){

    const [Movies, Generos] = await ReadJson.getData(); 
    const UserMovies = await LikeModel.getLikesByUser(user); //peliculas que le gustan al usuario


    const idMovies = UserMovies.map(movie => movie.movie); 
    const myGenres = new Set(); //generos de las peliculas que le gustan al usuario
    UserMovies.map(movie => {
      const movieId = movie.movie;
        Movies.forEach((movie,index)=>{
          if(movie.id===movieId){
            movie.genres = typeof movie.genres === 'string' ? JSON.parse(movie.genres.replace(/'/g, '"')) : movie.genres;
            movie.genres.forEach(genre => myGenres.add(genre.name));
          }
        })
      }); //generos de las peliculas que le gustan al usuario
      
      //peliculas filtradas por genero del usuario


    const myGenresString = [...myGenres].join(' ').toLowerCase();
    
    const pythonRecomendaciones = await this.executePythonScript(myGenresString);
    console.log("aqui en recomenda")
    return;
    

      
    
      const mapMovie = new Map();
      UserMovies.forEach((movie,index)=>{
        const movieId = movie.movie;
        if(!mapMovie.has(movieId)){
          mapMovie.set(movieId,mapMovie.size);
        }
      })

    
      //peliculas preferidas en un conjunto de 45k peliculas
      const userData = new Array(Movies.length).fill(0);

      //filtrar peliculas segun el genero que le gusta al usuario

     
      //data de peliculas preferidas
      UserMovies.forEach((movie,index)=>{
        const movieId = movie.movie;
        const movieIndex = mapMovie.get(movieId);
        userData[movieIndex]=1;
      })

      let data = Array.from(userData);


      const matrizDatos = Movies.map(pelicula => [
        pelicula.budget,
        pelicula.popularity,
        pelicula.revenue,
        pelicula.runtime,
        pelicula.vote_average,
        pelicula.vote_count
    ]);

      //console.log(matrizDatos);
      //console.log(userData.length)
      const { u, v, q } = SVD(matrizDatos);

      console.log(u)
      console.log(v)
      console.log(q)
  
      const vectorSingularDerecho = V.map(row => row[0]);

      const recomendaciones = peliculasFiltradas.sort((a, b) =>
        vectorSingularDerecho[peliculas.indexOf(b)] - vectorSingularDerecho[peliculas.indexOf(a)]
    ).map(pelicula => pelicula.titulo);

    console.log(recomendaciones);



     


  }

  static async executePythonScript(userGeneros){

        const pythonScriptPath = 'script.py';
    // Argumentos que puedes pasar al script de Python si es necesario
        const args = [userGeneros, 'arg2'];

    
        return new Promise((resolve, reject) => {
          const pythonProcess = spawn('python', [pythonScriptPath, ...args]);
          let dataBuffer = '';
  
          // Captura la salida del script de Python
          pythonProcess.stdout.on('data', (data) => {
              dataBuffer += data.toString();
              console.log("on process "+data)
          });
  
          // Maneja cualquier error durante la ejecución del script de Python
          pythonProcess.stderr.on('data', (data) => {
              reject(`Error en el script de Python: ${data}`);
          });
  
          // Maneja el cierre del proceso de Python
          pythonProcess.on('close', (code) => {
              if (code === 0) {
                  resolve(dataBuffer);
              } else {
                  reject(`Proceso de Python cerrado con código ${code}`);
              }
          });
      });
  }

      
}