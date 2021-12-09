import database from '../database/database.js';

const initUsersController = () => {
  const getUserById = async (req, res) => {
    if (!req.isLoggedIn) {
      res.status(403).redirect('/login');
      return;
    }

    const { id } = req.params;
    const userQuery = 'SELECT id, username, bio FROM users WHERE id = $1';
    const predictionQuery = 'SELECT pd.pick_id, pd.is_correct, g.*, ht.name AS home_team, at.name AS away_team FROM predictions p INNER JOIN prediction_details pd ON p.id = pd.prediction_id INNER JOIN games g ON pd.game_id = g.id INNER JOIN teams ht ON ht.id = g.home_team_id INNER JOIN teams at ON at.id = g.away_team_id WHERE p.user_id = $1 AND is_correct != -1';
    const aggregateQuery = 'SELECT p.id, p.date_col, SUM(is_correct) AS correct_guesses, COUNT(*) AS total_guesses FROM prediction_details AS pd INNER JOIN predictions AS p ON pd.prediction_id = p.id WHERE is_correct != -1 AND p.user_id = $1 GROUP BY p.id ORDER BY p.date_col DESC';

    try {
      const userResult = await database.query(userQuery, [id]);
      const [userInfo] = userResult.rows;

      const predResult = await database.query(predictionQuery, [id]);
      const gamesInfo = predResult.rows;

      const aggResult = await database.query(aggregateQuery, [id]);
      const predictionsAgg = aggResult.rows;
      const guesses = { correct: 0, total: 0, percentage: 0 };
      guesses.correct = predictionsAgg.reduce((acc, cur) => acc + Number(cur.correct_guesses), 0);
      guesses.total = predictionsAgg.reduce((acc, cur) => acc + Number(cur.total_guesses), 0);
      if (guesses.total > 0) {
        guesses.percentage = ((guesses.correct / guesses.total) * 100).toFixed(2);
      }
      res.render('user', {
        userInfo, gamesInfo, predictionsAgg, guesses, user: req.cookies,
      });
    } catch (err) { res.status(500).send(err); }
  };

  const editUserBio = async (req, res) => {
    if (!req.isLoggedIn) {
      res.status(403).redirect('/login');
      return;
    }

    const { id } = req.params;

    const editQuery = 'UPDATE users SET bio = $1 WHERE id = $2';

    try {
      await database.query(editQuery, [req.body.bio, id]);
      res.redirect(`/user/${id}`);
    } catch (err) { res.status(500).send(err); }
  };

  return { getUserById, editUserBio };
};

export default initUsersController;
