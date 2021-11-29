import express from 'express';
import checkAuth from '../middleware/auth.js';

const router = express.Router();
router.use(checkAuth);

const showChatWindow = (req, res) => {
  if (!req.isLoggedIn) {
    res.status(403).redirect('/login');
    return;
  }

  res.render('chat', { user: req.cookies });
};

router.get('/', showChatWindow);

export default router;
