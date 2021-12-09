import moment from 'moment-timezone';
import database from '../database/database.js';

const initPredictionsController = () => {
  const getPredictionForm = (req, res) => {
    if (!req.isLoggedIn) {
      res.status(403).redirect('/login');
      return;
    }

    const today = moment().tz('Asia/Singapore').subtract(15, 'h');
    if (today.hour() >= 9) {
      res.render('prediction-fail');
      return;
    }
    const todayDate = today.format('YYYY-MM-DD');
    const todayFormatted = today.format('dddd, MMMM Do, YYYY');
    let games;

    const selectQuery = 'SELECT g.*, t1.name AS home_team, t1.abbreviation AS home_team_abbrev, t2.name AS away_team, t2.abbreviation AS away_team_abbrev FROM games AS g INNER JOIN teams as t1 ON g.home_team_id = t1.id INNER JOIN teams as t2 ON g.away_team_id = t2.id WHERE date_col = $1 ORDER BY id';
    const userPredictionQuery = 'SELECT * FROM predictions p INNER JOIN prediction_details pd ON p.id = pd.prediction_id WHERE user_id = $1 AND date_col = $2';

    database
      .query(selectQuery, [todayDate])
      .then((result) => {
        games = result.rows;
        return database.query(userPredictionQuery, [req.cookies.userID, todayDate]);
      })
      .then((result) => {
        res.render('new-prediction', {
          date: todayFormatted, games, userPredictions: result.rows, user: req.cookies,
        });
      });
  };

  const addNewPrediction = (req, res) => {
    if (!req.isLoggedIn) {
      res.status(403).redirect('/login');
      return;
    }

    const today = moment().tz('Asia/Singapore').subtract(15, 'h');
    const todayDate = today.format('YYYY-MM-DD');

    if (today.hour() >= 9) {
      res.render('prediction-fail');
      return;
    }

    const predictions = req.body;
    const insertPredictionQuery = 'INSERT INTO predictions (user_id, date_col) VALUES ((SELECT id FROM users WHERE username = $1), $2) RETURNING *';
    let insertDetailsQuery = 'INSERT INTO prediction_details (prediction_id, game_id, pick_id) VALUES ';
    Object.keys(predictions).forEach((gameID, index) => {
      insertDetailsQuery += `($1, ${gameID}, ${predictions[gameID]})`;
      if (index !== Object.keys(predictions).length - 1) {
        insertDetailsQuery += ', ';
      }
    });

    database
      .query(insertPredictionQuery, [req.cookies.userName, todayDate])
      .then((result) => {
        const predictionID = result.rows[0].id;
        return database.query(insertDetailsQuery, [predictionID]);
      })
      .then((result) => {
        res.redirect('/');
      })
      .catch((err) => res.status(500).send(err));
  };

  const editPrediction = (req, res) => {
    if (!req.isLoggedIn) {
      res.status(403).redirect('/login');
      return;
    }

    const today = moment().tz('Asia/Singapore').subtract(15, 'h');

    if (today.hour() >= 9) {
      res.render('prediction-fail');
      return;
    }

    const { id } = req.params;
    const predictions = req.body;
    let updateDetailsQuery = 'UPDATE prediction_details AS pd SET prediction_id = pd2.prediction_id, game_id = pd2.game_id, pick_id = pd2.pick_id FROM (VALUES ';
    Object.keys(predictions).forEach((gameID, index) => {
      updateDetailsQuery += `(${id}, ${gameID}, ${predictions[gameID]})`;
      if (index !== Object.keys(predictions).length - 1) {
        updateDetailsQuery += ', ';
      } else updateDetailsQuery += ') ';
    });
    updateDetailsQuery += 'AS pd2(prediction_id, game_id, pick_id) WHERE pd.game_id = pd2.game_id AND pd.prediction_id = pd2.prediction_id';

    database
      .query(updateDetailsQuery)
      .then((result) => {
        res.redirect('/');
      })
      .catch((err) => res.status(500).send(err));
  };

  const deletePrediction = (req, res) => {
    if (!req.isLoggedIn) {
      res.status(403).redirect('/login');
      return;
    }

    const today = moment().tz('Asia/Singapore').subtract(15, 'h');

    if (today.hour() >= 9) {
      res.render('prediction-fail');
      return;
    }

    const { id } = req.params;

    const deleteDetailsQuery = 'DELETE FROM prediction_details WHERE prediction_id = $1';
    const deletePredictionQuery = 'DELETE FROM predictions WHERE id = $1';

    database
      .query(deleteDetailsQuery, [id])
      .then((result) => database.query(deletePredictionQuery, [id]))
      .then((result) => res.redirect('/'));
  };

  return {
    getPredictionForm, addNewPrediction, editPrediction, deletePrediction,
  };
};

export default initPredictionsController;
