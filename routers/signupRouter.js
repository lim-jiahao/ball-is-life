import express from 'express';
import initSignupController from '../controllers/signupController.js';

const router = express.Router();

const SignupController = initSignupController();

router
  .route('/')
  .get(SignupController.getSignupPage)
  .post(SignupController.createNewUser);

export default router;
