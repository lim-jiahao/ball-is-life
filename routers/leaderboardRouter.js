import express from 'express';
import initLeaderboardController from '../controllers/leaderboardController.js';

const router = express.Router();

const LeaderboardController = initLeaderboardController();

router.get('/', LeaderboardController.getLeaderboard);

export default router;
