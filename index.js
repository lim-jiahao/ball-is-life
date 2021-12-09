import express from 'express';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import bindRoutes from './utils/routes.js';
import scheduler from './utils/schedule.js';
import initialiseChatSockets from './utils/chat.js';

dotenv.config();
const PORT = process.env.PORT ?? 3004;

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(cookieParser());
const httpServer = createServer(app);

const io = new Server(httpServer);
initialiseChatSockets(io);

bindRoutes(app);

httpServer.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  scheduler.scheduleJob();
});
