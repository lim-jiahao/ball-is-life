import express from 'express';
import axios from 'axios';
import moment from 'moment-timezone';
import checkAuth from '../middleware/auth.js';
import database from '../database/database.js';

const router = express.Router();
router.use(checkAuth);

const getGames = (req, res) => {
  if (!req.isLoggedIn) {
    res.status(403).redirect('/login');
    return;
  }

  let games;
  const today = moment().tz('Asia/Singapore').subtract(15, 'h');
  const todayDate = today.format('YYYY-MM-DD');
  const todayFormatted = today.format('dddd, MMMM Do, YYYY');
  const todaySearch = today.format('MMMM Do YYYY');
  const hidePredictionButton = today.hour() >= 9;

  let timeLeft;
  let timeToNextPrediction;

  axios
    .get(`https://www.balldontlie.io/api/v1/games?start_date=${todayDate}&end_date=${todayDate}`)
    .then((resp) => {
      games = resp.data.data;
      const userPredictionQuery = 'SELECT * FROM predictions WHERE user_id = $1 AND date_col = $2';

      if (!hidePredictionButton && games.length > 0) {
        const mmt = moment().tz('Asia/Singapore');
        const mmtMidnight = mmt.clone().endOf('day');
        timeLeft = mmtMidnight.diff(mmt, 'seconds');
      } else {
        const nextPredictionOpen = today.clone().endOf('day');
        timeToNextPrediction = nextPredictionOpen.diff(today, 'seconds');
      }

      return database.query(userPredictionQuery, [req.cookies.userID, todayDate]);
    })
    .then((result) => {
      res.render('index', {
        date: [todayFormatted, todaySearch],
        games,
        userPredictions: result.rows,
        user: req.cookies,
        hidePredictionButton,
        timeLeft,
        timeToNextPrediction,
      });
    })
    .catch((err) => { res.status(500).send(err); });
};

router.get('/', getGames);

export default router;
