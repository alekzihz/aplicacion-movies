import fetch from 'node-fetch';

const url = 'https://api.themoviedb.org/3/movie/31357/images';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMTI0YWEwZjA5MGM4YzY0MzkyNmJkYmUyNzczNjZjNSIsInN1YiI6IjY1NjUyZWQ1YzJiOWRmMDBjNjlkM2NmYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.LIjdYOHmN8hqm4v6IsKu7nveMDpXVbviLD0Ya-kraJw'
  }
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error('error:' + err));