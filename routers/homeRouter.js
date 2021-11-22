import express from 'express';
import axios from 'axios';
import moment from 'moment-timezone';
import database from '../database/database.js';

const router = express.Router();

const getGames = (req, res) => {
  if (!req.cookies.loggedIn) {
    res.status(403).redirect('/login');
    return;
  }

  const today = moment().tz('Asia/Singapore').subtract(15, 'h');
  const todayDate = today.format('YYYY-MM-DD');
  const todayFormatted = today.format('dddd, MMMM Do, YYYY');

  axios
    .get(`https://www.balldontlie.io/api/v1/games?start_date=${todayDate}&end_date=${todayDate}`)
    .then((resp) => { res.render('index', { date: todayFormatted, games: resp.data.data }); })
    .catch((err) => { res.status(500).send(err); });
};

router.get('/', getGames);

export default router;
