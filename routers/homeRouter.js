import express from 'express';
import axios from 'axios';
import moment from 'moment-timezone';
import database from '../database/database.js';

const router = express.Router();

const getGames = async (req, res) => {
  const today = moment().tz('Asia/Singapore').subtract(15, 'h').format('YYYY-MM-DD');

  axios
    .get(`https://www.balldontlie.io/api/v1/games?start_date=${today}&end_date=${today}`)
    .then((resp) => { res.render('index', { games: resp.data.data }); })
    .catch((err) => { res.status(500).send(err); });
};

router.get('/', getGames);

export default router;
