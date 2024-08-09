import { AuthValidator } from './../validators/authValidator';
import { Express } from 'express';
import AuthRoutes from './authRoutes';
import swaggerDocs from '../utils/swagger';
import createAuthService from '../services/authService';
import AuthController from '../controllers/AuthController';
import MovieController from '../controllers/MoviesController';
import { MovieValidator } from '../validators/movieValidator';
import { createMovieLookupService } from '../services/movieLookupService';
import MovieRoutes from './movieRoutes';
import { createStorageService } from '../services/s3StorageService';
import createMoviesService from '../services/moviesService';

export default class Routes {
  constructor(app: Express) {
    app.use('/api/auth', new AuthRoutes(new AuthController(createAuthService()), new AuthValidator()).router);
    app.use(
      '/api/movies',
      new MovieRoutes(
        new MovieController(createMovieLookupService(), createStorageService(), createMoviesService()),
        new MovieValidator()
      ).router
    );
    swaggerDocs(app);
  }
}
