import { Request, Response, NextFunction } from 'express';
import { MovieLookupService } from '../services/movieLookupService';
import { S3StorageService } from '../services/s3StorageService';
import { CreateMovieParam, MoviesService } from '../services/moviesService';
export default class MovieController {
  private readonly movieLookupService: MovieLookupService;
  private readonly s3StorageService: S3StorageService;
  private readonly moviesService: MoviesService;
  constructor(
    movieLookupService: MovieLookupService,
    s3StorageService: S3StorageService,
    moviesService: MoviesService
  ) {
    this.movieLookupService = movieLookupService;
    this.s3StorageService = s3StorageService;
    this.moviesService = moviesService;
  }
  async lookupMovie(req: any, res: Response, next: NextFunction) {
    const { query } = req.query;
    const result = await this.movieLookupService.findMovieDetailsByQuery(query);
    return res.status(200).json(result);
  }
  async getUploadPresignedUrl(req: any, res: Response, next: NextFunction) {
    const { filename } = req.body;
    const response = await this.s3StorageService.generateUploadPresignedPost({
      fileName: filename,
      expiry: 3600,
      path: 'uploads/',
      maxFileSize: 1024 * 2048,
      minFileSize: 1,
    });
    return res.status(200).json(response);
  }

  async createMovie(req: any, res: Response, next: NextFunction) {
    const body = req.body as Omit<CreateMovieParam, 'userId'>;
    const user = req.user as any;
    if (!(await this.s3StorageService.objectExists(body.poster))) {
      return res.status(400).json([
        {
          error: 'Poster does not exist',
          loc: 'body',
          path: 'poster',
        },
      ]);
    }
    const result = await this.moviesService.createMovie({ ...body, userId: user.id });
    result.poster = await this.s3StorageService.generateDownloadPreSignedUrl({
      objectKey: result.poster,
      expiry: 3600,
    });
    return res.status(201).json(result);
  }
  async updateMovie(req: any, res: Response, next: NextFunction) {
    const body = req.body as Omit<CreateMovieParam, 'userId'> & { id: string };
    const user = req.user as any;
    if (body.poster && !(await this.s3StorageService.objectExists(body.poster))) {
      return res.status(400).json([
        {
          error: 'Poster does not exist',
          loc: 'body',
          path: 'poster',
        },
      ]);
    }
    const result = await this.moviesService.updateMovie({ ...body, userId: user.id });
    result.poster = await this.s3StorageService.generateDownloadPreSignedUrl({
      objectKey: result.poster,
      expiry: 3600,
    });
    return res.status(200).json(result);
  }
  async getAllMovies(req: any, res: Response, next: NextFunction) {
    const user = req.user as any;
    const { query, genre, pageSize = 20, offset = 0 } = req.query;

    const result = await this.moviesService.getAllMovies({
      query: query,
      genre: genre,
      userId: user.id,
      offset: parseInt(offset) * 20,
      pageSize: parseInt(pageSize),
    });

    const { total, items } = result;

    for (const movie of items) {
      movie.poster = await this.s3StorageService.generateDownloadPreSignedUrl({
        objectKey: movie.poster,
        expiry: 3600,
      });
    }

    return res.status(200).json({ total, items });
  }
}
