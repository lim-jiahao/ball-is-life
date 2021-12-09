import express from 'express';
import initDaysController from '../controllers/daysController.js';

const router = express.Router();

const DaysController = initDaysController();

router.get('/:date', DaysController.getDay);

export default router;
