const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { pool } = require('../config/db');
const User = require('../models/User');

function issueToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      username: user.username,
      isAdmin: user.is_admin,
      isPremium: user.is_premium
    },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '7d' }
  );
}

function createTransport() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || 'false') === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  }
  return nodemailer.createTransport({ jsonTransport: true });
}

async function requestMagicLink(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const token = crypto.randomBytes(24).toString('hex');
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await pool.query('INSERT INTO magic_links (email, token, expires_at) VALUES ($1,$2,$3)', [email, token, expiresAt]);

  const webBase = process.env.PUBLIC_WEB_BASE || 'http://localhost:3000';
  const magicUrl = `${webBase}/login?token=${token}`;

  const transporter = createTransport();
  await transporter.sendMail({
    from: process.env.MAIL_FROM || 'no-reply@dua.me',
    to: email,
    subject: 'Your Dua.me sign in link',
    text: `Use this link to sign in: ${magicUrl}`
  });

  return res.json({ ok: true, magicLink: magicUrl });
}

async function verifyMagicLink(req, res) {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Token is required' });

  const { rows } = await pool.query(
    'SELECT id, email FROM magic_links WHERE token = $1 AND used_at IS NULL AND expires_at > NOW() ORDER BY id DESC LIMIT 1',
    [token]
  );
  const record = rows[0];
  if (!record) return res.status(400).json({ error: 'Invalid or expired magic link' });

  await pool.query('UPDATE magic_links SET used_at = NOW() WHERE id = $1', [record.id]);

  let user = await User.findByEmail(record.email);
  if (!user) user = await User.createEmailUser(record.email);

  const jwtToken = issueToken(user);
  return res.json({ token: jwtToken, user });
}

async function me(req, res) {
  const user = await User.findById(req.user.sub);
  if (!user) return res.status(404).json({ error: 'Not found' });
  return res.json(user);
}

function logout(_req, res) {
  return res.json({ ok: true });
}

module.exports = { requestMagicLink, verifyMagicLink, logout, issueToken, me };
