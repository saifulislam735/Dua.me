const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const { passport, configurePassport } = require('./config/passport');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
configurePassport();

const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(origin => origin.length > 0);

if (allowedOrigins.length === 0 && process.env.NODE_ENV === 'production') {
  throw new Error('CORS_ORIGINS must be set in production');
}

const corsOptions = allowedOrigins.length > 0
  ? { origin: allowedOrigins, credentials: true }
  : { origin: true };

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors(corsOptions));
app.use(express.json());

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV === 'production') {
  throw new Error('SESSION_SECRET is required in production');
}

app.use(session({
  secret: sessionSecret || 'dua-session',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax'
  }
}));
app.use(passport.initialize());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/messages', messageRoutes);
app.use('/admin', adminRoutes);
app.use('/payments', paymentRoutes);

if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/build');
  app.use(express.static(frontendPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/auth') || req.path.startsWith('/users') || req.path.startsWith('/messages') || req.path.startsWith('/admin') || req.path.startsWith('/payments')) {
      return next();
    }
    return res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

module.exports = app;
