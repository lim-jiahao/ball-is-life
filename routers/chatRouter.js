import express from 'express';

const router = express.Router();

const showChatWindow = (req, res) => {
  if (!req.isLoggedIn) {
    res.status(403).redirect('/login');
    return;
  }

  const { id } = req.params;
  res.render('chat', { id, user: req.cookies });
};

router.get('/:id', showChatWindow);

export default router;
