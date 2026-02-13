const express = require('express');
const { initBkash, executeBkash, initSslcommerz, completeSslcommerz } = require('../controllers/paymentsController');

const router = express.Router();

router.post('/bkash/init', initBkash);
router.post('/bkash/execute', executeBkash);
router.post('/sslcommerz/init', initSslcommerz);
router.post('/sslcommerz/complete', completeSslcommerz);

module.exports = router;
