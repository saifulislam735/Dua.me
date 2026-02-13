const windowMs = 60 * 1000;
const maxRequests = 10;
const buckets = new Map();

function senderRateLimiter(req, res, next) {
  const key = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const now = Date.now();
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
