import axios from 'axios';
import moment from 'moment-timezone';

const initDaysController = () => {
  const getDay = async (req, res) => {
    const { date } = req.params;
    const dateFormatted = moment(date).format('dddd, MMMM Do, YYYY');
    const dateSearch = moment(date).format('MMMM Do YYYY');

    try {
      const resp = await axios.get(`https://www.balldontlie.io/api/v1/games?start_date=${date}&end_date=${date}`);

      res.render('day', {
        games: resp.data.data,
        date: [dateFormatted, dateSearch],
        user: req.cookies,
      });
    } catch (err) { res.status(500).send(err); }
  };

  return { getDay };
};

export default initDaysController;
