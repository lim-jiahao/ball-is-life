import express from 'express';
import checkAuth from '../middleware/auth.js';
import initHomeController from '../controllers/homeController.js';

const router = express.Router();
router.use(checkAuth);

const HomeController = initHomeController();

router.get('/', HomeController.getGames);

export default router;
