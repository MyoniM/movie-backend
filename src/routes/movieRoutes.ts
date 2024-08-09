import { Router } from 'express';
import { asyncMiddleware } from '../middlewares/asyncHandler';
import userAuth from '../middlewares/userAuth';
import MovieController from '../controllers/MoviesController';
import { MovieValidator } from '../validators/movieValidator';

class MovieRoutes {
  router: Router;
  private movieController: MovieController;
  private movieValidator: MovieValidator;

  constructor(movieController: MovieController, movieValidator: MovieValidator) {
    this.router = Router();
    this.movieController = movieController;
    this.movieValidator = movieValidator;
    this.movieController.lookupMovie = this.movieController.lookupMovie.bind(this.movieController);
    this.movieController.getUploadPresignedUrl = this.movieController.getUploadPresignedUrl.bind(this.movieController);
    this.movieController.createMovie = this.movieController.createMovie.bind(this.movieController);
    this.movieController.updateMovie = this.movieController.updateMovie.bind(this.movieController);
    this.movieController.getAllMovies = this.movieController.getAllMovies.bind(this.movieController);
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router
      .route('/lookup-movie')
      .get(userAuth, this.movieValidator.validateLookupMovie(), asyncMiddleware(this.movieController.lookupMovie));
    this.router
      .route('/get-presigned-upload-url')
      .post(
        userAuth,
        this.movieValidator.validateGetPresignedUploadUrl(),
        asyncMiddleware(this.movieController.getUploadPresignedUrl)
      );
    this.router
      .route('/create')
      .post(userAuth, this.movieValidator.validateCreateMovie(), asyncMiddleware(this.movieController.createMovie));
    this.router
      .route('/update')
      .put(userAuth, this.movieValidator.validateUpdateMovie(), asyncMiddleware(this.movieController.updateMovie));
    this.router.route('/get-all').get(userAuth, asyncMiddleware(this.movieController.getAllMovies));
  }
}

export default MovieRoutes;
