import express from 'express';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import dotenv from 'dotenv';
import homeRouter from './routers/homeRouter.js';
import loginRouter from './routers/loginRouter.js';
import signupRouter from './routers/signupRouter.js';
import logoutRouter from './routers/logoutRouter.js';
import predictionRouter from './routers/predictionRouter.js';
import leaderboardRouter from './routers/leaderboardRouter.js';
import gameRouter from './routers/gameRouter.js';
import userRouter from './routers/userRouter.js';
import dayRouter from './routers/dayRouter.js';
import scheduler from './utils/schedule.js';

dotenv.config();
const PORT = process.env.PORT ?? 3004;

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
app.use('/day', dayRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  scheduler.scheduleJob();
});
