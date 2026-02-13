const express = require('express');
const { initBkash, initSslcommerz } = require('../controllers/paymentsController');

const router = express.Router();

router.post('/bkash/init', initBkash);
router.post('/sslcommerz/init', initSslcommerz);

module.exports = router;
