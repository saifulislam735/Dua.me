function initBkash(_req, res) {
  res.json({ provider: 'bkash', status: 'mock_success', paymentId: `bk_${Date.now()}` });
}

function initSslcommerz(_req, res) {
  res.json({ provider: 'sslcommerz', status: 'mock_success', transactionId: `ssl_${Date.now()}` });
}

module.exports = { initBkash, initSslcommerz };
