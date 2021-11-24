import express from 'express';
import JSSHA from 'jssha';
import database from '../database/database.js';

const router = express.Router();

const getSignupPage = (req, res) => {
  if (!req.cookies.loggedIn) res.render('login-signup', { page: '/signup', loggedOut: true });
  else res.redirect('/');
};

const createNewUser = (req, res) => {
  const shaObj = new JSSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
  shaObj.update(req.body.password);
  const hashedPassword = shaObj.getHash('HEX');

  const args = Object.values(req.body);
  args.pop();
  args.push(hashedPassword);
  args.push(new Date());
  const sqlQuery = 'INSERT INTO users (email, username, password, created_at) VALUES ($1, $2, $3, $4) RETURNING *';

  database
    .query(sqlQuery, args)
    .then((result) => {
      res.cookie('userName', result.rows[0].username);
      res.cookie('userID', result.rows[0].id);
      res.cookie('loggedIn', true);
      res.redirect('/');
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

router
  .route('/')
  .get(getSignupPage)
  .post(createNewUser);

export default router;
