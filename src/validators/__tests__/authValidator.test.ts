import { AuthValidator, loginSchema } from '../authValidator';
import { Request, Response, NextFunction } from 'express';

describe('AuthValidator', () => {
  let authValidator: AuthValidator;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    authValidator = new AuthValidator();
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  const mockResponseFactory = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  });

  describe('validate', () => {
    it('should call next if validation passes', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const validateMiddleware = authValidator.validate(loginSchema, 'body');
      await validateMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return 400 if validation fails', async () => {
      mockRequest.body = {
        email: 'invalid-email',
        password: '',
      };

      const validateMiddleware = authValidator.validate(loginSchema, 'body');
      await validateMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith([
        { error: '"email" must be a valid email', path: 'email', loc: 'body' },
        { error: '"password" is not allowed to be empty', path: 'password', loc: 'body' },
      ]);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('validateLogin', () => {
    it('should validate login schema', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const validateLogin = authValidator.validateLogin();
      await validateLogin(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });

  describe('validateRegister', () => {
    it('should validate register schema', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const validateRegister = authValidator.validateRegister();
      await validateRegister(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });

  describe('validateChangePassword', () => {
    it('should validate change password schema', async () => {
      mockRequest.body = {
        oldPassword: 'OldPassword123',
        newPassword: 'NewPassword123',
      };

      const validateChangePassword = authValidator.validateChangePassword();
      await validateChangePassword(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });
});
