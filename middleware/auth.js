import { getUserIdHash } from '../utils/hash.js';

const checkAuth = (req, res, next) => {
  req.isLoggedIn = false;

  if (req.cookies.loggedIn && req.cookies.userID) {
    const hash = getUserIdHash(req.cookies.userID);

    if (req.cookies.loggedIn === hash) {
      req.isLoggedIn = true;
    }
  }

  if (!req.isLoggedIn) {
    res.status(403).redirect('/login');
    return;
  }
  next();
};

export default checkAuth;
