function configureSocket(io) {
  io.on('connection', (socket) => {
    socket.on('inbox:subscribe', (userId) => {
      if (!userId) return;
      socket.join(`inbox:${userId}`);
    });
  });
}

module.exports = { configureSocket };
