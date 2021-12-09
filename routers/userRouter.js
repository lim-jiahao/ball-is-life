import express from 'express';
import checkAuth from '../middleware/auth.js';
import initUsersController from '../controllers/usersController.js';

const router = express.Router();
router.use(checkAuth);

const UsersController = initUsersController();

router.get('/:id', UsersController.getUserById);
router.put('/:id/edit', UsersController.editUserBio);

export default router;
