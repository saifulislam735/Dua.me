const express = require('express');
const { passport } = require('../config/passport');
const { requestMagicLink, verifyMagicLink, logout, issueToken, me } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/email/magic-link', requestMagicLink);
router.get('/magic/verify', verifyMagicLink);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/auth/google/failure' }), (req, res) => {
  const token = issueToken(req.user);
  res.json({ token, user: req.user });
});
router.get('/google/failure', (_req, res) => res.status(401).json({ error: 'Google authentication failed' }));

router.get('/me', authMiddleware, me);
router.get('/logout', logout);

module.exports = router;
