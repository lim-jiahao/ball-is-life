import express from 'express';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import bindRoutes from './routes.js';
import scheduler from './utils/schedule.js';

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

bindRoutes(app);

io.on('connection', (socket) => {
  let chatRoom = 'default';

  socket.on('subscribe', (room) => {
    chatRoom = room;
    socket.join(room);
  });

  socket.on('chat', (data) => {
    let username = data[1];
    if (username === '') {
      username = 'Unknown User';
    }
    const msg = data[0];
    io.to(chatRoom).emit('chatMessage', [msg, username]);
  });

  socket.on('disconnect', () => {});
});

httpServer.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  scheduler.scheduleJob();
});
