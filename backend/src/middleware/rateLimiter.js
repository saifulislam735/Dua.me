const windowMs = 60 * 1000;
const maxRequests = 10;
const buckets = new Map();

function senderRateLimiter(req, res, next) {
  const key = req.ip || 'unknown';
  const now = Date.now();

  // Evict buckets whose window has fully expired to prevent unbounded growth.
  for (const [bucketKey, bucket] of buckets.entries()) {
    if (now - bucket.start > windowMs) {
      buckets.delete(bucketKey);
    }
  }

  const entry = buckets.get(key) || { count: 0, start: now };

  if (now - entry.start > windowMs) {
    entry.count = 0;
    entry.start = now;
  }

  entry.count += 1;
  buckets.set(key, entry);

  if (entry.count > maxRequests) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }

  return next();
}

module.exports = { senderRateLimiter };
