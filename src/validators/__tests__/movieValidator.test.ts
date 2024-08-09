import { MovieValidator } from '../movieValidator';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

describe('MovieValidator', () => {
  let movieValidator: MovieValidator;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    movieValidator = new MovieValidator();
    mockRequest = {
      body: {},
      query: {},
      params: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('validateLookupMovie', () => {
    it('should call validate method with lookUpSchema and query property', () => {
      const validateSpy = jest.spyOn(movieValidator, 'validate');
      const validateLookupMovie = movieValidator.validateLookupMovie();

      validateLookupMovie(mockRequest as Request, mockResponse as Response, mockNext);

      expect(validateSpy).toHaveBeenCalledWith(expect.any(Object), 'query');
    });
  });

  describe('validateMoviePaginatedQuery', () => {
    it('should call validate method with moviePaginatedQuery and query property', () => {
      const validateSpy = jest.spyOn(movieValidator, 'validate');
      const validateMoviePaginatedQuery = movieValidator.validateMoviePaginatedQuery();

      validateMoviePaginatedQuery(mockRequest as Request, mockResponse as Response, mockNext);

      expect(validateSpy).toHaveBeenCalledWith(expect.any(Object), 'query');
    });
  });

  describe('validateGetPresignedUploadUrl', () => {
    it('should call validate method with getPresignedUploadUrlSchema and body property', () => {
      const validateSpy = jest.spyOn(movieValidator, 'validate');
      const validateGetPresignedUploadUrl = movieValidator.validateGetPresignedUploadUrl();

      validateGetPresignedUploadUrl(mockRequest as Request, mockResponse as Response, mockNext);

      expect(validateSpy).toHaveBeenCalledWith(expect.any(Object), 'body');
    });
  });

  describe('validateCreateMovie', () => {
    it('should call validate method with createMovieSchema and body property', () => {
      const validateSpy = jest.spyOn(movieValidator, 'validate');
      const validateCreateMovie = movieValidator.validateCreateMovie();

      validateCreateMovie(mockRequest as Request, mockResponse as Response, mockNext);

      expect(validateSpy).toHaveBeenCalledWith(expect.any(Object), 'body');
    });
  });

  describe('validateUpdateMovie', () => {
    it('should call validate method with updateMovieSchema and body property', () => {
      const validateSpy = jest.spyOn(movieValidator, 'validate');
      const validateUpdateMovie = movieValidator.validateUpdateMovie();

      validateUpdateMovie(mockRequest as Request, mockResponse as Response, mockNext);

      expect(validateSpy).toHaveBeenCalledWith(expect.any(Object), 'body');
    });
  });

  describe('validate', () => {
    it('should call next if validation passes', async () => {
      const schema = Joi.object({ test: Joi.string().required() });
      const validateMiddleware = movieValidator.validate(schema, 'body');

      mockRequest.body = { test: 'value' };

      await validateMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return 400 if validation fails', async () => {
      const schema = Joi.object({ test: Joi.string().required() });
      const validateMiddleware = movieValidator.validate(schema, 'body');

      mockRequest.body = {};

      await validateMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith([{ error: '"test" is required', path: 'test', loc: 'body' }]);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
