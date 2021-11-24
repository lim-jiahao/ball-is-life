import axios from 'axios';
import express from 'express';
import database from '../database/database.js';
import checkAuth from '../middleware/auth.js';

const router = express.Router();
router.use(checkAuth);

const getGameById = (req, res) => {
  if (!req.isLoggedIn) {
    res.status(403).redirect('/login');
    return;
  }

  const { id } = req.params;
  let game;
  axios
    .get(`https://www.balldontlie.io/api/v1/games/${id}`)
    .then((resp) => {
      game = resp.data;
      const commentQuery = 'SELECT c.*, u.username FROM comments AS c INNER JOIN users AS u on c.user_id = u.id WHERE c.game_id = $1 ORDER BY c.id';
      return database.query(commentQuery, [id]);
    })
    .then((result) => { res.render('game', { game, comments: result.rows, user: req.cookies }); })
    .catch((err) => { res.status(500).send(err); });
};

const addComment = (req, res) => {
  if (!req.isLoggedIn) {
    res.status(403).redirect('/login');
    return;
  }

  const { id } = req.params;
  const args = [req.body.comment, req.cookies.userName, id, new Date()];

  const sqlQuery = `INSERT INTO comments (comment, user_id, game_id, created_at)
                    VALUES ($1, 
                          (SELECT id FROM users WHERE username = $2),
                          $3, $4)`;

  database
    .query(sqlQuery, args)
    .then((result) => {
      res.redirect(`/game/${id}`);
    })
    .catch((err) => { res.status(500).send(err); });
};

router.get('/:id', getGameById);

router.post('/:id/comment', addComment);

export default router;
