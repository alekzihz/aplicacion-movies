import fs, { read } from 'fs';

export class ReadJson{
    constructor(){
        //this.Movies = JSON.parse(fs.readFileSync('../../appmovie.moviedbE.json', 'utf8'));
    }
    

    static async getData(){
        const data = JSON.parse(fs.readFileSync('appmovie.moviedbE.json', 'utf8'));
        let generosUnicos = new Set();
        data.forEach(movie => {
            movie.genres = typeof movie.genres === 'string' ? JSON.parse(movie.genres.replace(/'/g, '"')) : movie.genres;
            movie.genres.forEach(genre => generosUnicos.add(genre.name));
        })

        //const aqui = [...new Set(GenerosUnicos)];
        generosUnicos = Array.from(generosUnicos);
        //console.log(generosUnicos)
        return [data, generosUnicos];
        //console.log(Movies.length)
    
    }

}
//ReadJson.getData();