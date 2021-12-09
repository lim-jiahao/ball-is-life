import express from 'express';

const router = express.Router();

const getAboutPage = (req, res) => {
  res.render('about', { user: req.cookies });
};

router.get('/', getAboutPage);

export default router;
