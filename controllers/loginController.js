import database from '../database/database.js';
import { getUserIdHash, getPasswordHash } from '../utils/hash.js';

const initLoginController = () => {
  const getLoginPage = (req, res) => {
    if (!req.cookies.loggedIn) res.render('login-signup', { page: '/login' });
    else res.redirect('/');
  };

  const authUser = async (req, res) => {
    try {
      const result = await database.query('SELECT * from users WHERE username=$1', [req.body.username]);

      if (result.rows.length === 0) {
        res.status(403).redirect('/login');
        return;
      }
      const user = result.rows[0];
      const hashedPassword = getPasswordHash(req.body.password);

      if (user.password !== hashedPassword) {
        res.status(403).redirect('/login');
        return;
      }

      const hash = getUserIdHash(user.id);

      res.cookie('userName', user.username);
      res.cookie('userID', user.id);
      res.cookie('loggedIn', hash);
      res.redirect('/');
    } catch (error) { res.status(503).send(error); }
  };

  return { getLoginPage, authUser };
};

export default initLoginController;
