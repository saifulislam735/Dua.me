const express = require('express');
const { senderRateLimiter } = require('../middleware/rateLimiter');
const { authMiddleware } = require('../middleware/authMiddleware');
const { sendMessage, getInbox, replyMessage, reportMessage } = require('../controllers/messageController');

const router = express.Router();

router.post('/send/:username', senderRateLimiter, sendMessage);
router.get('/inbox', authMiddleware, getInbox);
router.post('/reply/:id', authMiddleware, replyMessage);
router.post('/report/:id', authMiddleware, reportMessage);

module.exports = router;
