import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { urlencoded, json, Express } from 'express';

import Routes from './routes';
import logger from './logger';
import passport from 'passport';
import rateLimiter from './middlewares/rateLimit';
import passportMiddleware from './middlewares/passport';
import { unCaughtErrorHandler } from './handlers/errorHandler';

export default class Server {
  constructor(app: Express) {
    this.config(app);
    new Routes(app);
  }

  public config(app: Express): void {
    const logPath = path.join(__dirname, '../logs');
    if (!fs.existsSync(logPath)) fs.mkdirSync(logPath);

    app.use(json());
    app.use(cors());
    app.use(rateLimiter()); //  apply to all requests
    app.use(passport.initialize());
    app.use(urlencoded({ extended: true }));

    passportMiddleware(passport);

    app.use(unCaughtErrorHandler);
  }
}

process.on('beforeExit', function (err) {
  logger.error(JSON.stringify(err));
  console.error(err);
});
