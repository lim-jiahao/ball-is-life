import homeRouter from '../routers/homeRouter.js';
import loginRouter from '../routers/loginRouter.js';
import signupRouter from '../routers/signupRouter.js';
import logoutRouter from '../routers/logoutRouter.js';
import predictionRouter from '../routers/predictionRouter.js';
import leaderboardRouter from '../routers/leaderboardRouter.js';
import gameRouter from '../routers/gameRouter.js';
import userRouter from '../routers/userRouter.js';
import dayRouter from '../routers/dayRouter.js';
import chatRouter from '../routers/chatRouter.js';
import aboutRouter from '../routers/aboutRouter.js';

const bindRoutes = (app) => {
  app.use('/', homeRouter);
  app.use('/login', loginRouter);
  app.use('/signup', signupRouter);
  app.use('/logout', logoutRouter);
  app.use('/prediction', predictionRouter);
  app.use('/leaderboard', leaderboardRouter);
  app.use('/game', gameRouter);
  app.use('/user', userRouter);
  app.use('/day', dayRouter);
  app.use('/chat', chatRouter);
  app.use('/about', aboutRouter);
};

export default bindRoutes;
