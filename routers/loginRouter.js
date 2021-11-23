import express from 'express';
import JSSHA from 'jssha';
import database from '../database/database.js';

const router = express.Router();

const getLoginPage = (req, res) => {
  if (!req.cookies.loggedIn) res.render('login-signup', { page: '/login', loggedOut: true });
  else res.redirect('/');
};

const authUser = (req, res) => {
  const values = [req.body.email];
  database
    .query('SELECT * from users WHERE email=$1', values)
    .then((result) => {
      if (result.rows.length === 0) {
        res.status(403).redirect('/login');
        return;
      }
      const user = result.rows[0];

      const shaObj = new JSSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
      shaObj.update(req.body.password);
      const hashedPassword = shaObj.getHash('HEX');

      if (user.password === hashedPassword) {
        res.cookie('userName', user.username);
        res.cookie('loggedIn', true);
        res.redirect('/');
      } else {
        res.status(403).redirect('/login');
      }
    })
    .catch((error) => {
      if (error) {
        res.status(503).send(error);
      }
    });
};

router
  .route('/')
  .get(getLoginPage)
  .post(authUser);

export default router;