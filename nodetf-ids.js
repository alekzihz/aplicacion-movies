//import tfidf from 'tf-idf';

var tfidf = require('tf-idf');

// Datos de ejemplo
const movies = [
    { title: 'Movie 1', genres: 'Action, Adventure' },
    { title: 'Movie 2', genres: 'Adventure, Sci-Fi' },
    { title: 'Movie 3', genres: 'Action, Comedy' }
];

// Preprocesamiento de datos
const documents = movies.map(movie => movie.genres.toLowerCase());

// Crear el modelo TF-IDF
const vectorizer = new tfidf();

// Entrenar el modelo
vectorizer.fit(documents);

// Transformar los datos
const tfidfMatrix = vectorizer.transform(documents);

console.log(tfidfMatrix);
