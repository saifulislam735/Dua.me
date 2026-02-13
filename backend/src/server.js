require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { configureSocket } = require('./config/socket');

const server = http.createServer(app);

// Configure Socket.IO CORS with allowed origins
const allowedOrigins = (process.env.SOCKET_IO_CORS_ORIGINS || process.env.CORS_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map(origin => origin.trim())
  .filter(origin => origin.length > 0);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

app.set('io', io);
configureSocket(io);

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Backend listening on ${port}`);
});
