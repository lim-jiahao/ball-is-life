import express from 'express';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import homeRouter from './routers/homeRouter.js';

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(cookieParser());

app.use('/', homeRouter);

app.listen(3004, () => console.log('App listening on port 3004'));
