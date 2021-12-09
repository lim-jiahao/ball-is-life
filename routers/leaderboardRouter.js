import express from 'express';
import checkAuth from '../middleware/auth.js';
import initLeaderboardController from '../controllers/leaderboardController.js';

const router = express.Router();
router.use(checkAuth);

const LeaderboardController = initLeaderboardController();

router.get('/', LeaderboardController.getLeaderboard);

export default router;
