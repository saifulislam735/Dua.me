const User = require('../models/User');

async function createOrUpdateProfile(req, res) {
  const profile = await User.upsertProfile({ ...req.body, id: req.user.sub });
  return res.json(profile);
}

async function getPublicProfile(req, res) {
  const profile = await User.findByUsername(req.params.username);
  if (!profile) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json(profile);
}

module.exports = { createOrUpdateProfile, getPublicProfile };
