const User = require('../models/User');

async function createOrUpdateProfile(req, res) {
  const username = req.body.username;
  if (!username) return res.status(400).json({ error: 'username is required' });
  const profile = await User.upsertProfile({ id: req.user.sub, username, email: req.user.email });
  return res.json(profile);
}

async function getPublicProfile(req, res) {
  const profile = await User.findByUsername(req.params.username);
  if (!profile) return res.status(404).json({ error: 'User not found' });
  return res.json(profile);
}

module.exports = { createOrUpdateProfile, getPublicProfile };
