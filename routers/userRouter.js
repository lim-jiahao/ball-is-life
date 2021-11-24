import express from 'express';
import database from '../database/database.js';

const router = express.Router();

const getUserById = (req, res) => {
  if (!req.cookies.loggedIn) {
    res.status(403).redirect('/login');
    return;
  }

  const { id } = req.params;

  const selectQuery = 'SELECT u.*, SUM(is_correct) AS correct_guesses, COUNT(*) AS total_guesses, round(SUM(is_correct) * 100.0 / COUNT(*)::numeric, 2) AS percentage FROM prediction_details AS pd INNER JOIN predictions AS p ON pd.prediction_id = p.id INNER JOIN users AS u ON p.user_id = u.id WHERE is_correct != -1 AND u.id = $1 GROUP BY u.id';

  database
    .query(selectQuery, [id])
    .then((result) => { res.render('user', { userInfo: result.rows[0], user: req.cookies }); })
    .catch((err) => { res.status(500).send(err); });
};

router.get('/:id', getUserById);

export default router;
