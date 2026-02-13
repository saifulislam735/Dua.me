function initBkash(req, res) {
  const amount = req.body?.amount || 99;
  res.json({
    provider: 'bkash',
    status: 'sandbox_initiated',
    paymentId: `bk_${Date.now()}`,
    amount,
    redirectUrl: `${process.env.PUBLIC_API_BASE || 'http://localhost:4000'}/payments/bkash/execute`
  });
}

function executeBkash(req, res) {
  res.json({ provider: 'bkash', status: 'sandbox_executed', trxId: `trx_${Date.now()}` });
}

function initSslcommerz(req, res) {
  const amount = req.body?.amount || 99;
  res.json({
    provider: 'sslcommerz',
    status: 'sandbox_initiated',
    sessionkey: `ssl_${Date.now()}`,
    amount,
    gatewayPageURL: 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
  });
}

function completeSslcommerz(_req, res) {
  res.json({ provider: 'sslcommerz', status: 'sandbox_completed' });
}

module.exports = { initBkash, executeBkash, initSslcommerz, completeSslcommerz };
