import express from 'express';
import moment from 'moment-timezone';
import database from '../database/database.js';

const router = express.Router();

const getNewPredictionForm = (req, res) => {
  if (!req.cookies.loggedIn) {
    res.status(403).redirect('/login');
    return;
  }

  const today = moment().tz('Asia/Singapore').subtract(15, 'h');
  const todayDate = today.format('YYYY-MM-DD');
  const todayFormatted = today.format('dddd, MMMM Do, YYYY');

  const selectQuery = 'SELECT g.*, t1.name AS home_team, t2.name AS away_team FROM games AS g INNER JOIN teams as t1 ON g.home_team_id = t1.id INNER JOIN teams as t2 ON g.away_team_id = t2.id WHERE date_col = $1 ORDER BY id';

  database
    .query(selectQuery, [todayDate])
    .then((result) => {
      res.render('new-prediction', { date: todayFormatted, games: result.rows, userName: req.cookies.userName });
    });
};

const addNewPrediction = (req, res) => {
  if (!req.cookies.loggedIn) {
    res.status(403).redirect('/login');
    return;
  }

  const predictions = req.body;
  const today = moment().tz('Asia/Singapore').subtract(15, 'h');
  const insertPredictionQuery = 'INSERT INTO predictions (user_id, date_col) VALUES ((SELECT id FROM users WHERE username = $1), $2) RETURNING *';
  let insertDetailsQuery = 'INSERT INTO prediction_details (prediction_id, game_id, pick_id) VALUES ';
  Object.keys(predictions).forEach((gameID, index) => {
    insertDetailsQuery += `($1, ${gameID}, ${predictions[gameID]})`;
    if (index !== Object.keys(predictions).length - 1) {
      insertDetailsQuery += ', ';
    }
  });

  database
    .query(insertPredictionQuery, [req.cookies.userName, today])
    .then((result) => {
      const predictionID = result.rows[0].id;
      return database.query(insertDetailsQuery, [predictionID]);
    })
    .then((result) => {
      res.redirect('/');
    })
    .catch((err) => res.status(500).send(err));
};

router
  .route('/')
  .get(getNewPredictionForm)
  .post(addNewPrediction);

export default router;