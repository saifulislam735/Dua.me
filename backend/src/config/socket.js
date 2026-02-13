function configureSocket(io) {
  io.on('connection', (socket) => {
    socket.on('inbox:subscribe', (receiverId) => {
      socket.join(`inbox:${receiverId}`);
    });
  });
}

module.exports = { configureSocket };
