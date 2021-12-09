import express from 'express';
import initUsersController from '../controllers/usersController.js';

const router = express.Router();

const UsersController = initUsersController();

router.get('/:id', UsersController.getUserById);
router.put('/:id/edit', UsersController.editUserBio);

export default router;
