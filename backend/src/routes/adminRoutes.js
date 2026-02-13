const express = require('express');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');
const { getReports, deleteUser, deleteMessage } = require('../controllers/adminController');

const router = express.Router();

router.use(authMiddleware, adminOnly);
router.get('/reports', getReports);
router.delete('/users/:id', deleteUser);
router.delete('/messages/:id', deleteMessage);

module.exports = router;
