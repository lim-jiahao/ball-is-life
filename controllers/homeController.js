import axios from 'axios';
import moment from 'moment-timezone';
import database from '../database/database.js';

const initHomeController = () => {
  const getGames = async (req, res) => {
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

    try {
      const resp = await axios.get(`https://www.balldontlie.io/api/v1/games?start_date=${todayDate}&end_date=${todayDate}`);
      games = resp.data.data;

      if (!hidePredictionButton && games.length > 0) {
        const mmt = moment().tz('Asia/Singapore');
        const mmtMidnight = mmt.clone().endOf('day');
        timeLeft = mmtMidnight.diff(mmt, 'seconds');
      } else {
        const nextPredictionOpen = today.clone().endOf('day');
        timeToNextPrediction = nextPredictionOpen.diff(today, 'seconds');
      }

      const userPredictionQuery = 'SELECT * FROM predictions WHERE user_id = $1 AND date_col = $2';
      const predResult = await database.query(userPredictionQuery, [req.cookies.userID, todayDate]);
      const userPredictions = predResult.rows;

      const allDatesQuery = 'SELECT DISTINCT date_col FROM games ORDER BY date_col DESC';
      const dateResult = await database.query(allDatesQuery);
      const allDates = dateResult.rows.map((date) => ({
        short: moment(date.date_col).format('YYYY-MM-DD'),
        long: moment(date.date_col).format('dddd, MMMM Do, YYYY'),
      }));

      res.render('index', {
        date: [todayFormatted, todaySearch],
        games,
        allDates,
        userPredictions,
        user: req.cookies,
        hidePredictionButton,
        timeLeft,
        timeToNextPrediction,
      });
    } catch (err) { res.status(500).send(err); }
  };

  return { getGames };
};

export default initHomeController;
