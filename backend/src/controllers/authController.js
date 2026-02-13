const jwt = require('jsonwebtoken');

function issueToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
}

async function googleAuth(req, res) {
  const { googleId, email } = req.body;
  const token = issueToken({ sub: googleId, email, isAdmin: false });
  return res.json({ token });
}

async function emailAuth(req, res) {
  const { email } = req.body;
  const token = issueToken({ sub: email, email, isAdmin: false });
  return res.json({ token });
}

async function logout(_req, res) {
  return res.json({ ok: true });
}

module.exports = { googleAuth, emailAuth, logout };
