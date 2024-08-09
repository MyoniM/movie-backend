import { Request, Response, NextFunction } from 'express';

export function unCaughtErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.log(err);
  res.end({ error: err });
}

export function apiErrorHandler(err: any, req: Request, res: Response, message: string) {
  res.status(500).json({ error: message, path: null, loc: null });
  console.log(err);
}
