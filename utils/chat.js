const initialiseChatSockets = (io) => {
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
};

export default initialiseChatSockets;
