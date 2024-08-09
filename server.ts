import dotenv from 'dotenv';
dotenv.config();
import express, { Express } from 'express';
import ApiServer from './src/index';
const app: Express = express();
new ApiServer(app);
const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
app
  .listen(port, function () {
    console.info(`Server running on PORT ${port}`);
  })
  .on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.log('server startup error: address already in use');
    } else {
      console.log(err);
    }
  });
