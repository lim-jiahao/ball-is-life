import express from 'express';
import database from '../database/database.js';

const router = express.Router();

const getLeaderboard = (req, res) => {
  if (!req.cookies.loggedIn) {
    res.status(403).redirect('/login');
    return;
  }

  const sqlQuery = 'SELECT p.user_id, (SELECT username FROM users WHERE id = p.user_id), SUM(is_correct) AS correct_guesses, COUNT(*) AS total_guesses, round(SUM(is_correct) * 100.0 / COUNT(*)::numeric, 2) AS percentage FROM prediction_details AS pd INNER JOIN predictions AS p ON pd.prediction_id = p.id WHERE is_correct != -1 GROUP BY p.user_id ORDER BY percentage desc';

  database
    .query(sqlQuery)
    .then((result) => {
      res.render('leaderboard', { leaders: result.rows, user: req.cookies });
    })
    .catch((err) => { res.status(500).send(err); });
};

router.get('/', getLeaderboard);

export default router;
