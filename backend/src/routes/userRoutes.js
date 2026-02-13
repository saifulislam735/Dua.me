const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { createOrUpdateProfile, getPublicProfile, setPremium } = require('../controllers/userController');

const router = express.Router();

router.post('/profile', authMiddleware, createOrUpdateProfile);
router.post('/premium', authMiddleware, setPremium);
router.get('/:username', getPublicProfile);

module.exports = router;
