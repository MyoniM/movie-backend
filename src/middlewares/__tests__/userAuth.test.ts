import passport from 'passport';
import userAuth from '../userAuth';
import { Request, Response, NextFunction } from 'express';

jest.mock('passport');

describe('userAuth Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should call next with an error if passport returns an error', () => {
    const mockAuthenticate = jest.fn((req, res, done) => done(new Error('Authentication Error')));
    (passport.authenticate as jest.Mock).mockImplementation(() => mockAuthenticate);

    userAuth(req as Request, res as Response, next);

    expect(passport.authenticate).toHaveBeenCalledWith('jwt', { session: false }, expect.any(Function));
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
