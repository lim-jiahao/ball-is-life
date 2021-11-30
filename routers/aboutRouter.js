import express from 'express';
import checkAuth from '../middleware/auth.js';

const router = express.Router();
router.use(checkAuth);

const getAboutPage = (req, res) => {
  res.render('about', { user: req.cookies });
};

router.get('/', getAboutPage);

export default router;
