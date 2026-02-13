require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { configureSocket } = require('./config/socket');

const allowedOrigins = (process.env.SOCKET_IO_CORS_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(origin => origin.length > 0);

if (allowedOrigins.length === 0 && process.env.NODE_ENV === 'production') {
  throw new Error('SOCKET_IO_CORS_ORIGINS must be set in production');
}

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: allowedOrigins.length > 0 ? allowedOrigins : true } });

app.set('io', io);
configureSocket(io);

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Backend listening on ${port}`);
});
