import axios from 'axios';
import moment from 'moment-timezone';
import database from './database.js';

const insertIntoGames = (gamesData) => {
  const sqlQuery = 'INSERT INTO games (id, home_team_id, away_team_id, date_col, home_team_score, away_team_score, winner_id) VALUES ($1, $2, $3, $4, $5, $6, $7)';

  gamesData.forEach((game) => {
    const gameOver = game.status === 'Final';

    let winnerID;
    if (gameOver) {
      winnerID = game.home_team_score > game.visitor_team_score
        ? game.home_team.id : game.visitor_team.id;
    } else winnerID = null;

    const args = [
      game.id,
      game.home_team.id,
      game.visitor_team.id,
      game.date,
      game.home_team_score,
      game.visitor_team_score,
      winnerID,
    ];

    // eslint-disable-next-line no-unused-vars
    database.query(sqlQuery, args, (err, result) => {
      if (err) {
        console.log(err);
      }
    });
  });
};

const getDaysArray = (start, end) => {
  let arr;
  let dt;
  for (arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    arr.push(moment(new Date(dt)).format('YYYY-MM-DD'));
  }
  return arr;
};

const makeAPICall = () => {
  const seasonDates = getDaysArray(new Date('2022-03-01'), new Date('2022-04-10'));

  seasonDates.forEach((date) => {
    axios
      .get(`https://www.balldontlie.io/api/v1/games?start_date=${date}&end_date=${date}`)
      .then((resp) => {
        const gamesData = resp.data.data;
        insertIntoGames(gamesData);
      })
      .catch((err) => console.log(err));
  });
};

makeAPICall();
