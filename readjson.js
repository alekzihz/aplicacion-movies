import fs from 'fs';



const Movies = JSON.parse(fs.readFileSync('appmovie.moviedbE.json', 'utf8'));

console.log(Movies.length)