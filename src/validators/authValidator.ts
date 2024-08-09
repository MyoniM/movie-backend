import Joi, { Schema, ValidationError } from 'joi';
import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  value?: { body?: string };
}

export class AuthValidator {
  constructor() {}

  validateLogin() {
    return this.validate(loginSchema, 'body');
  }

  validateRegister() {
    return this.validate(registerSchema, 'body');
  }

  validateChangePassword() {
    return this.validate(changePasswordSchema, 'body');
  }

  validate(schema: Schema, property: 'body' | 'query' | 'params') {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
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
export const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const registerSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const changePasswordSchema = Joi.object().keys({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
});
