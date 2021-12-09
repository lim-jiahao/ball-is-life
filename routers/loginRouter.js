import express from 'express';
import initLoginController from '../controllers/loginController.js';

const router = express.Router();
const LoginController = initLoginController();

router
  .route('/')
  .get(LoginController.getLoginPage)
  .post(LoginController.authUser);

export default router;
