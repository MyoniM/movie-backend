import Joi, { ValidationError, Schema } from 'joi';
import { Request, Response, NextFunction } from 'express';

export interface MovieRequest extends Request {
  value?: {
    body?: any;
    query?: any;
    params?: any;
  };
}

export class MovieValidator {
  constructor() {}
  validateLookupMovie() {
    return this.validate(lookUpSchema, 'query');
  }
  validateMoviePaginatedQuery() {
    return this.validate(moviePaginatedQuery, 'query');
  }
  validateGetPresignedUploadUrl() {
    return this.validate(getPresignedUploadUrlSchema, 'body');
  }
  validateCreateMovie() {
    return this.validate(createMovieSchema, 'body');
  }
  validateUpdateMovie() {
    return this.validate(updateMovieSchema, 'body');
  }

  validate(schema: Schema, property: 'body' | 'query' | 'params') {
    return async (req: MovieRequest, res: Response, next: NextFunction) => {
      try {
        const val = await schema.validateAsync(req[property], { abortEarly: false });
        req.value = req.value ?? {};
        req.value[property] = req.value[property] ?? val;
        next();
      } catch (error) {
        if ((error as ValidationError).isJoi) {
          const formattedErrors = (error as ValidationError).details.map((detail) => ({
            error: detail.message,
            path: detail.path.join('.'),
            loc: property,
          }));
          res.status(400).json(formattedErrors);
        } else {
          next(error);
        }
      }
    };
  }
}

export const lookUpSchema = Joi.object().keys({
  query: Joi.string().required(),
});

export const getPresignedUploadUrlSchema = Joi.object().keys({
  filename: Joi.string().required(),
});

const createMovieSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.string().required(),
  rated: Joi.string().allow(null, ''),
  genre: Joi.string().allow(null, ''),
  imdbRating: Joi.string().allow(null, ''),
  poster: Joi.string().required(),
});
const updateMovieSchema = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().optional(),
  year: Joi.string().optional(),
  rated: Joi.string().optional(),
  genre: Joi.string().optional(),
  imdbRating: Joi.string().optional(),
  poster: Joi.string().optional(),
});

const moviePaginatedQuery = Joi.object({
  offset: Joi.number().min(0).default(0),
  pageSize: Joi.number().min(1).max(100).default(10),
  query: Joi.string().allow(null, ''),
  genre: Joi.string().allow(null, ''),
});
