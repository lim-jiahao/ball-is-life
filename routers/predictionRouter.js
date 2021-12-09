import express from 'express';
import initPredictionsController from '../controllers/predictionsController.js';

const router = express.Router();

const PredictionsController = initPredictionsController();

router
  .route('/')
  .get(PredictionsController.getPredictionForm)
  .post(PredictionsController.addNewPrediction);

router
  .route('/:id')
  .put(PredictionsController.editPrediction)
  .delete(PredictionsController.deletePrediction);

export default router;
