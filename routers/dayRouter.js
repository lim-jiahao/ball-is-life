import express from 'express';
import axios from 'axios';
import moment from 'moment-timezone';
import checkAuth from '../middleware/auth.js';

const router = express.Router();
router.use(checkAuth);

const getDay = (req, res) => {
  if (!req.isLoggedIn) {
    res.status(403).redirect('/login');
    return;
  }

  const { date } = req.params;
  const dateFormatted = moment(date).format('dddd, MMMM Do, YYYY');
  const dateSearch = moment(date).format('MMMM Do YYYY');

  axios
    .get(`https://www.balldontlie.io/api/v1/games?start_date=${date}&end_date=${date}`)
    .then((resp) => {
      res.render('day', {
        games: resp.data.data,
        date: [dateFormatted, dateSearch],
        user: req.cookies,
      });
    })
    .catch((err) => { res.status(500).send(err); });
};

router.get('/:date', getDay);
export default router;
