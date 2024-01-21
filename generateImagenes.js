import fetch from 'node-fetch';
import { readFile } from 'fs/promises'
import axios from 'axios';




//const url = 'https://api.themoviedb.org/3/movie/31357/images';
//let id = 842;
//const urlMovieId = `http://localhost:3000/movies/findmovie/${id}`;
//const urlImagen= `https://api.themoviedb.org/3/movie/${id}/images?include_image_language=es`;
//const allMovies = `http://localhost:3000/movies/everything`;

const file = await readFile('./appmovie.moviedbE.json', 'utf-8')
const json = JSON.parse(file)
console.log(json)



//const url = 'https://api.themoviedb.org/3/movie/31357/watch/providers';
//const url = 'https://api.themoviedb.org/3/movie/862/videos?language=en-US';
//const url = 'https://api.themoviedb.org/3/collection/collection_id/images';
//const url = 'https://api.themoviedb.org/3/find/862?external_source=';






//fetch (allMovies).then(res => res.json()).then(movie => 
  //{
    for (const movies of json) {

      console.log(movies.id)
      let id = movies.id;
      let urlResourceImage = 0
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMTI0YWEwZjA5MGM4YzY0MzkyNmJkYmUyNzczNjZjNSIsInN1YiI6IjY1NjUyZWQ1YzJiOWRmMDBjNjlkM2NmYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.LIjdYOHmN8hqm4v6IsKu7nveMDpXVbviLD0Ya-kraJw'
          
        }
      }; 

      //const urlImagen= `https://api.themoviedb.org/3/movie/${id}/images`;
      //const url = 'https://api.themoviedb.org/3/movie/111359/images?language=en';
      const urlImagen = `https://api.themoviedb.org/3/movie/${id}/images?language=en`;

      axios.get(urlImagen, options).then(res => res.json()).then(imagen => 
        {
          if (imagen.posters && imagen.posters.length > 0)urlResourceImage= "https://image.tmdb.org/t/p/w500"+imagen.posters[0].file_path;
          return
        }
      
      ).then( () =>{
        
        const url = 'http://localhost:3000/movies/addimage';
        const data = {id: id, resource_image: urlResourceImage};
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data),
        };
        fetch(url, options).then(res => {
          
        }).then(movie => {
          console.log(id)
          console.log("fin")
        
        });
  
      })

      .catch(err => console.error(err)); 
    }

   




  //});





