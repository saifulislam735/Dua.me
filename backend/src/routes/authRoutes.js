const express = require('express');
const { googleAuth, emailAuth, logout } = require('../controllers/authController');

const router = express.Router();

router.post('/google', googleAuth);
router.post('/email', emailAuth);
router.get('/logout', logout);

module.exports = router;
