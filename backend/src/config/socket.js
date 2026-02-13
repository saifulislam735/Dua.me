const jwt = require('jsonwebtoken');

function configureSocket(io) {
  io.on('connection', (socket) => {
    let authenticatedUserId = null;

    // Extract JWT from handshake (either auth.token or Authorization header)
    const authToken =
      (socket.handshake &&
        socket.handshake.auth &&
        socket.handshake.auth.token) ||
      (socket.handshake &&
        socket.handshake.headers &&
        socket.handshake.headers.authorization);

    if (authToken) {
      let token = authToken;
      // Support "Bearer <token>" format
      if (typeof token === 'string' && token.startsWith('Bearer ')) {
        token = token.slice('Bearer '.length).trim();
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        authenticatedUserId =
          (decoded && (decoded.sub || decoded.userId || decoded.id)) || null;
      } catch (e) {
        // Invalid token; leave authenticatedUserId as null
      }
    }

    socket.on('inbox:subscribe', (userId) => {
      // Ignore client-supplied userId and rely on authenticated user identity
      if (!authenticatedUserId) return;
      socket.join(`inbox:${authenticatedUserId}`);
    });
  });
}

module.exports = { configureSocket };
