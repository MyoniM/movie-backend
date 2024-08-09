import { urlencoded, json, Express } from 'express';
import fs from 'fs';
import { WriteStream } from 'fs';
import path from 'path';

import rateLimiter from './middlewares/rateLimit';
import { unCaughtErrorHandler } from './handlers/errorHandler';
import Routes from './routes';
import passport from 'passport';
import passportMiddleware from './middlewares/passport';
import cors from 'cors';

export default class Server {
  constructor(app: Express) {
    this.config(app);
    new Routes(app);
  }

  public config(app: Express): void {
    const logPath = path.join(__dirname, '../logs');
    if (!fs.existsSync(logPath)) {
      fs.mkdirSync(logPath);
    }
    app.use(urlencoded({ extended: true }));
    app.use(json());
    app.use(cors());
    app.use(rateLimiter()); //  apply to all requests
    app.use(passport.initialize());

    passportMiddleware(passport);

    app.use(unCaughtErrorHandler);
  }
}
