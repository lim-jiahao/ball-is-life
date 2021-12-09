import express from 'express';
import initHomeController from '../controllers/homeController.js';

const router = express.Router();

const HomeController = initHomeController();

router.get('/', HomeController.getGames);

export default router;
