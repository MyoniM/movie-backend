import { rateLimit } from 'express-rate-limit';
import { rateLimitTime, rateLimitRequest } from '../config';

export default () => {
  return rateLimit({
    windowMs: rateLimitTime,
    limit: rateLimitRequest, // limit each IP to "rateLimitRequest" requests per windowMs
    message: 'Rate limit exceeded, please try again later some time.',
  });
};
