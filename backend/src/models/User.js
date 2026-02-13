const { pool } = require('../config/db');

function normalizeUsername(input) {
  return String(input || '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 24);
}

async function usernameExists(username, excludeId = null) {
  const { rows } = await pool.query(
    'SELECT 1 FROM users WHERE username = $1 AND ($2::uuid IS NULL OR id <> $2::uuid)',
    [username, excludeId]
  );
  return rows.length > 0;
}

async function generateUniqueUsername(base = 'user', excludeId = null) {
  const clean = normalizeUsername(base) || 'user';
  if (!(await usernameExists(clean, excludeId))) return clean;
  let n = 1;
  while (n < 10000) {
    const candidate = `${clean}${n}`;
    if (!(await usernameExists(candidate, excludeId))) return candidate;
    n += 1;
  }
  throw new Error('Unable to generate username');
}

async function upsertProfile({ id, username, email }) {
  const finalUsername = await generateUniqueUsername(username, id);
  const shareableLink = `dua.me/@${finalUsername}`;

  const query = `
    INSERT INTO users (id, username, email, shareable_link, is_admin, is_premium)
    VALUES ($1, $2, $3, $4, false, false)
    ON CONFLICT (id)
    DO UPDATE SET username = EXCLUDED.username, email = COALESCE(EXCLUDED.email, users.email), shareable_link = EXCLUDED.shareable_link
    RETURNING id, username, email, shareable_link, is_admin, is_premium;
  `;
  const { rows } = await pool.query(query, [id, finalUsername, email || null, shareableLink]);
  return rows[0];
}

async function createEmailUser(email) {
  const username = await generateUniqueUsername(email.split('@')[0]);
  const shareableLink = `dua.me/@${username}`;
  const { rows } = await pool.query(
    'INSERT INTO users (username, email, shareable_link, is_admin, is_premium) VALUES ($1,$2,$3,false,false) RETURNING id, username, email, shareable_link, is_admin, is_premium',
    [username, email, shareableLink]
  );
  return rows[0];
}

async function findOrCreateGoogleUser({ googleId, email, displayName }) {
  const found = await pool.query('SELECT id, username, email, shareable_link, is_admin, is_premium FROM users WHERE google_id = $1', [googleId]);
  if (found.rows[0]) return found.rows[0];

  const base = displayName || (email ? email.split('@')[0] : 'user');
  const username = await generateUniqueUsername(base);
  const shareableLink = `dua.me/@${username}`;
  const { rows } = await pool.query(
    'INSERT INTO users (username, email, google_id, shareable_link, is_admin, is_premium) VALUES ($1,$2,$3,$4,false,false) RETURNING id, username, email, shareable_link, is_admin, is_premium',
    [username, email || null, googleId, shareableLink]
  );
  return rows[0];
}

async function findByEmail(email) {
  const { rows } = await pool.query('SELECT id, username, email, shareable_link, is_admin, is_premium FROM users WHERE email = $1', [email]);
  return rows[0];
}

async function findByUsername(username) {
  const clean = String(username).replace(/^@/, '');
  const { rows } = await pool.query('SELECT id, username, shareable_link FROM users WHERE username = $1', [clean]);
  return rows[0];
}

async function findById(id) {
  const { rows } = await pool.query('SELECT id, username, email, shareable_link, is_admin, is_premium FROM users WHERE id = $1', [id]);
  return rows[0];
}

async function updatePremium(userId, isPremium) {
  const { rows } = await pool.query(
    'UPDATE users SET is_premium = $2 WHERE id = $1 RETURNING id, username, email, shareable_link, is_admin, is_premium',
    [userId, !!isPremium]
  );
  return rows[0];
}

module.exports = {
  upsertProfile,
  findByUsername,
  findById,
  findByEmail,
  createEmailUser,
  findOrCreateGoogleUser,
  generateUniqueUsername,
  updatePremium
};
