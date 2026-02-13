const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { passport, configurePassport } = require('./config/passport');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
configurePassport();

app.use(helmet({ crossOriginResourcePolicy: false }));

// Configure CORS with environment-based origin restrictions
const allowedOrigins = process.env.PUBLIC_WEB_BASE 
  ? process.env.PUBLIC_WEB_BASE.split(',').map(o => o.trim())
  : ['http://localhost:3000'];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(passport.initialize());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/messages', messageRoutes);
app.use('/admin', adminRoutes);
app.use('/payments', paymentRoutes);

if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../public');
  app.use(express.static(frontendPath));
  app.get('*', (req, res, next) => {
    if (['/auth', '/users', '/messages', '/admin', '/payments', '/health'].some((prefix) => req.path.startsWith(prefix))) {
      return next();
    }
    return res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

module.exports = app;
