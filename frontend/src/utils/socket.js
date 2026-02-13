import { io } from 'socket.io-client';

export function createSocket() {
  const base = process.env.REACT_APP_API_BASE || 'http://localhost:4000';
  return io(base, { transports: ['websocket'] });
}
