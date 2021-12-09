import express from 'express';
import checkAuth from '../middleware/auth.js';
import initDaysController from '../controllers/daysController.js';

const router = express.Router();
router.use(checkAuth);

const DaysController = initDaysController();

router.get('/:date', DaysController.getDay);

export default router;
