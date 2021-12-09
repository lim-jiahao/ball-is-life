import express from 'express';
import checkAuth from '../middleware/auth.js';
import initGamesController from '../controllers/gamesController.js';

const router = express.Router();
router.use(checkAuth);

const GamesController = initGamesController();

router.get('/:id', GamesController.getGameById);

router.post('/:id/comment', GamesController.addComment);

router
  .route('/:id/comment/:commentId')
  .put(GamesController.editComment)
  .delete(GamesController.deleteComment);

export default router;
