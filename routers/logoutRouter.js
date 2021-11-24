import express from 'express';

const router = express.Router();

const logoutUser = (req, res) => {
  if (req.cookies.loggedIn) {
    res.clearCookie('loggedIn');
    res.clearCookie('userName');
    res.clearCookie('userID');
  }

  res.redirect('/login');
};

router.get('/', logoutUser);

export default router;
