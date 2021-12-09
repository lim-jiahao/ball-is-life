import axios from 'axios';
import moment from 'moment-timezone';
import database from '../database/database.js';

const initGamesController = () => {
  const getGameById = async (req, res) => {
    if (!req.isLoggedIn) {
      res.status(403).redirect('/login');
      return;
    }

    const { id } = req.params;

    try {
      const resp = await axios.get(`https://www.balldontlie.io/api/v1/games/${id}`);
      const game = resp.data;
      const gameDate = moment(new Date(game.date));
      game.date = gameDate.format('dddd, MMMM Do, YYYY');
      const date = gameDate.format('MMMM Do YYYY');

      const commentQuery = 'SELECT c.*, u.username FROM comments AS c INNER JOIN users AS u on c.user_id = u.id WHERE c.game_id = $1 ORDER BY c.id';
      const result = await database.query(commentQuery, [id]);
      res.render('game', {
        game, date, comments: result.rows, user: req.cookies,
      });
    } catch (err) { res.status(500).send(err); }
  };

  const addComment = async (req, res) => {
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

    try {
      await database.query(sqlQuery, args);
      res.redirect(`/game/${id}`);
    } catch (err) { res.status(500).send(err); }
  };

  const editComment = async (req, res) => {
    if (!req.isLoggedIn) {
      res.status(403).redirect('/login');
      return;
    }

    const { id, commentId } = req.params;

    const editQuery = 'UPDATE comments SET comment = $1 WHERE id = $2';

    try {
      await database.query(editQuery, [req.body.comment, commentId]);
      res.redirect(`/game/${id}`);
    } catch (err) { res.status(500).send(err); }
  };

  const deleteComment = async (req, res) => {
    if (!req.isLoggedIn) {
      res.status(403).redirect('/login');
      return;
    }

    const { id, commentId } = req.params;

    const deleteQuery = 'DELETE FROM comments WHERE id = $1';

    try {
      await database.query(deleteQuery, [commentId]);
      res.redirect(`/game/${id}`);
    } catch (err) { res.status(500).send(err); }
  };

  return {
    getGameById, addComment, editComment, deleteComment,
  };
};

export default initGamesController;
