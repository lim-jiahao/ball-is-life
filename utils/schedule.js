import schedule from 'node-schedule';
import moment from 'moment-timezone';
import axios from 'axios';
import database from '../database/database.js';

const today = moment().tz('Asia/Singapore').subtract(1, 'd');
const todayDate = today.format('YYYY-MM-DD');

const rule = new schedule.RecurrenceRule();
rule.hour = 15;
// rule.second = 0;
rule.tz = 'Asia/Singapore';

const updateGameResults = async () => {
  try {
    const games = await axios.get(`https://www.balldontlie.io/api/v1/games?start_date=${todayDate}&end_date=${todayDate}`);

    const gamesData = games.data.data;

    const updateQuery = 'UPDATE games SET home_team_score = $1, away_team_score = $2, winner_id = $3 WHERE id = $4';

    gamesData.forEach((game) => {
      const winnerID = game.home_team_score > game.visitor_team_score
        ? game.home_team.id : game.visitor_team.id;

      const args = [
        game.home_team_score,
        game.visitor_team_score,
        winnerID,
        game.id,
      ];

      database
        .query(updateQuery, args)
        .then((result) => {
          const selectQuery = 'UPDATE prediction_details SET is_correct = ( CASE WHEN (pick_id = $1) THEN 1 ELSE 0 END) WHERE game_id = $2';
          return database.query(selectQuery, [winnerID, game.id]);
        })
        .then((result) => {})
        .catch((error) => console.log(error));
    });
  } catch (err) {
    console.log(err);
  }
};

const scheduler = {
  scheduleJob: () => schedule.scheduleJob(rule, updateGameResults),
};

export default scheduler;
