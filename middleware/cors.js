import cors from 'cors'

const ACCEPTED_ORIGINS = [
    'http://localhost:3000',
    'https://aplicacion-movies-dev-pfra.1.ie-1.fl0.io',
    'https://image.tmdb.org/',
    'https://image.tmdb.org/t/p/w500',
    'https://image.tmdb.org/t/p/w500/vzmL6fP7aPKNKPRTFnZmiUfciyV.jpg'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
    origin: (origin, callback) => {
      return callback(null, true)
  
      return callback(new Error('Not allowed by CORS'))
    }
  })