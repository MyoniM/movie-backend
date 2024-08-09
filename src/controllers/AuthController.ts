import { Request, Response, NextFunction } from 'express';
import { sign } from 'jsonwebtoken';
import moment from 'moment';
import { AuthService } from '../services/authService';
import { jwtSecret } from '../config';
import { hashPassword } from '../utils/auth';
export default class AuthController {
  private readonly authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async loginUser(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const user = await this.authService.getUserByEmail(email);
    // Check if user exists or if the password is valid
    if (!user || !(await this.authService.comparePassword(password, user.password))) {
      return res.status(401).json([{ error: 'Invalid Credentials!', path: null, loc: 'body' }]);
    } else {
      const token = sign(
        {
          id: user.id,
          email: user.email,
        },
        jwtSecret!,
        { expiresIn: '7 days' }
      );
      const result = {
        token: `Bearer ${token}`,
        expiryDate: moment().add(168, 'hours'),
        id: user.id,
        email: user.email,
      };
      return res.status(200).json(result);
    }
  }
  async registerUser(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const userExists = await this.authService.getUserByEmail(email);
    // Check if user by that email already exists
    if (userExists) {
      return res.status(401).json([{ message: 'Email already taken!', path: 'email', loc: 'body' }]);
    } else {
      await this.authService.createUser({
        email,
        password,
      });
      return res.status(200).json({
        message: 'Registered successfully!',
      });
    }
  }

  async getCurrentUser(req: any, res: Response, next: NextFunction) {
    const user = req.user as any;
    const result = {
      id: user.id,
      email: user.email,
    };
    return res.status(200).json(result);
  }

  async changePassword(req: any, res: Response, next: NextFunction) {
    const { oldPassword, newPassword } = req.body;
    const user = await this.authService.getUserById(req.user.id, undefined);
    // Check if password matches
    if (!(await this.authService.comparePassword(oldPassword, user.password))) {
      return res.status(401).json([{ error: 'Old password is incorrect', path: 'oldPassword', loc: 'body' }]);
    } else {
      this.authService.changePassword({
        id: user.id,
        password: newPassword,
      });
      return res.status(201).json({ message: 'Password changed successfully' });
    }
  }
}
