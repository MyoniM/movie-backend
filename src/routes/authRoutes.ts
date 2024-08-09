import { AuthValidator } from './../validators/authValidator';
import { Router } from 'express';
import { asyncMiddleware } from '../middlewares/asyncHandler';
import userAuth from '../middlewares/userAuth';
import AuthController from '../controllers/AuthController';

class AuthRoutes {
  router: Router;
  private authController: AuthController;
  private authValidator: AuthValidator;

  constructor(authController: AuthController, authValidator: AuthValidator) {
    this.router = Router();
    this.authController = authController;
    this.authValidator = authValidator;
    this.authController.loginUser = this.authController.loginUser.bind(this.authController);
    this.authController.registerUser = this.authController.registerUser.bind(this.authController);
    this.authController.getCurrentUser = this.authController.getCurrentUser.bind(this.authController);
    this.authController.changePassword = this.authController.changePassword.bind(this.authController);
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router
      .route('/login-user')
      .post(this.authValidator.validateLogin(), asyncMiddleware(this.authController.loginUser));
    this.router
      .route('/register-user')
      .post(this.authValidator.validateRegister(), asyncMiddleware(this.authController.registerUser));
    this.router.route('/current-user').get(userAuth, asyncMiddleware(this.authController.getCurrentUser));
    this.router
      .route('/change-password')
      .post(userAuth, this.authValidator.validateChangePassword(), asyncMiddleware(this.authController.changePassword));
  }
}

export default AuthRoutes;
