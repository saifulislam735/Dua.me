import { io } from 'socket.io-client';

export function createSocket(token) {
  const base = process.env.REACT_APP_API_BASE || 'http://localhost:4000';
  const options = { transports: ['websocket'] };
  
  if (token) {
    options.auth = { token };
  }
  
  return io(base, options);
}
