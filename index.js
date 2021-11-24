import express from 'express';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import homeRouter from './routers/homeRouter.js';
import loginRouter from './routers/loginRouter.js';
import signupRouter from './routers/signupRouter.js';
import logoutRouter from './routers/logoutRouter.js';
import predictionRouter from './routers/predictionRouter.js';
import leaderboardRouter from './routers/leaderboardRouter.js';
import gameRouter from './routers/gameRouter.js';
import userRouter from './routers/userRouter.js';
import scheduler from './utils/schedule.js';

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(cookieParser());

app.use('/', homeRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/logout', logoutRouter);
app.use('/prediction', predictionRouter);
app.use('/leaderboard', leaderboardRouter);
app.use('/game', gameRouter);
app.use('/user', userRouter);

app.listen(3004, () => {
  console.log('App listening on port 3004');
  scheduler.scheduleJob();
});
