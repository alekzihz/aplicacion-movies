// Función para generar recomendaciones basadas en contenido
function getRecommendationsBasedOnContent(userId, movies, userInteractions) {
    // Filtrar películas con las que el usuario ha interactuado positivamente
    const userLikedMovies = userInteractions
      .filter(interaction => interaction.userId === userId && interaction.rating === 1)
      .map(interaction => interaction.movieId);
  
    // Calcular la similitud de las películas basándose en el género (puedes expandir esto)
    const movieSimilarity = {};
    movies.forEach(movie => {
      const intersection = userLikedMovies.filter(movieId => movie.genres.includes(movieId));
      const similarity = intersection.length / Math.sqrt(userLikedMovies.length * movie.genres.length);
      movieSimilarity[movie.id] = similarity;
    });
  
    // Ordenar películas por similitud y devolver las recomendaciones
    const recommendations = movies
      .filter(movie => !userLikedMovies.includes(movie.id)) // Excluir películas ya vistas
      .sort((a, b) => movieSimilarity[b.id] - movieSimilarity[a.id]) // Ordenar por similitud
      .slice(0, 5); // Obtener las primeras 5 recomendaciones
  
    return recommendations;
  }
  

  // Ruta en el servidor para registrar interacciones
app.post('/api/log-interaction', (req, res) => {
    const { movieId } = req.body;
  
    // Almacena la interacción en tu base de datos
    // Puedes implementar lógica más avanzada según tus necesidades
  
    res.status(200).json({ message: 'Interacción registrada correctamente' });
  });
  
  // Ruta en el servidor para obtener recomendaciones
  app.get('/api/get-recommendations', (req, res) => {
    // Implementa la lógica para generar recomendaciones basadas en el historial del usuario
  
    res.status(200).json({ recommendations: [...recomendaciones] });
  });
  