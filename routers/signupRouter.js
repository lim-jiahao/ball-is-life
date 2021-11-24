import express from 'express';
import database from '../database/database.js';
import { getUserIdHash, getPasswordHash } from '../utils/hash.js';

const router = express.Router();

const getSignupPage = (req, res) => {
  if (!req.cookies.loggedIn) res.render('login-signup', { page: '/signup', loggedOut: true });
  else res.redirect('/');
};

const createNewUser = (req, res) => {
  const hashedPassword = getPasswordHash(req.body.password);

  const args = Object.values(req.body);
  args.pop();
  args.push(hashedPassword);
  args.push(new Date());
  const sqlQuery = 'INSERT INTO users (email, username, password, created_at) VALUES ($1, $2, $3, $4) RETURNING *';

  database
    .query(sqlQuery, args)
    .then((result) => {
      const user = result.rows[0];
      const hash = getUserIdHash(user.id);
      res.cookie('userName', user.username);
      res.cookie('userID', user.id);
      res.cookie('loggedIn', hash);
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
