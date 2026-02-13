const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { createOrUpdateProfile, getPublicProfile } = require('../controllers/userController');

const router = express.Router();

router.post('/profile', authMiddleware, createOrUpdateProfile);
router.get('/:username', getPublicProfile);

module.exports = router;
