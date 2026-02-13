const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { configureSocket } = require('./config/socket');

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.set('io', io);
configureSocket(io);

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Backend listening on ${port}`);
});
