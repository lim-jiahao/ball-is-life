import axios from 'axios';
import moment from 'moment-timezone';
import database from '../database/database.js';

const initGamesController = () => {
  const getGameById = (req, res) => {
    if (!req.isLoggedIn) {
      res.status(403).redirect('/login');
      return;
    }

    const { id } = req.params;
    let game;
    let date;
    axios
      .get(`https://www.balldontlie.io/api/v1/games/${id}`)
      .then((resp) => {
        game = resp.data;
        const gameDate = moment(new Date(game.date));
        game.date = gameDate.format('dddd, MMMM Do, YYYY');
        date = gameDate.format('MMMM Do YYYY');
        const commentQuery = 'SELECT c.*, u.username FROM comments AS c INNER JOIN users AS u on c.user_id = u.id WHERE c.game_id = $1 ORDER BY c.id';
        return database.query(commentQuery, [id]);
      })
      .then((result) => { res.render('game', {
        game, date, comments: result.rows, user: req.cookies,
      }); })
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

  const editComment = (req, res) => {
    if (!req.isLoggedIn) {
      res.status(403).redirect('/login');
      return;
    }

    const { id, commentId } = req.params;

    const editQuery = 'UPDATE comments SET comment = $1 WHERE id = $2';
    database
      .query(editQuery, [req.body.comment, commentId])
      .then((result) => { res.redirect(`/game/${id}`); })
      .catch((err) => res.status(500).send(err));
  };

  const deleteComment = (req, res) => {
    if (!req.isLoggedIn) {
      res.status(403).redirect('/login');
      return;
    }

    const { id, commentId } = req.params;

    const deleteQuery = 'DELETE FROM comments WHERE id = $1';
    database
      .query(deleteQuery, [commentId])
      .then((result) => { res.redirect(`/game/${id}`); })
      .catch((err) => res.status(500).send(err));
  };

  return {
    getGameById, addComment, editComment, deleteComment,
  };
};

export default initGamesController;
