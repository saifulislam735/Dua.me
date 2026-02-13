const { pool } = require('../config/db');

async function upsertProfile({ id, username, email, googleId }) {
  const shareableLink = `dua.me/${username}`;
  const query = `
    INSERT INTO users (id, username, email, google_id, shareable_link)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (id)
    DO UPDATE SET username = EXCLUDED.username, email = EXCLUDED.email, shareable_link = EXCLUDED.shareable_link
    RETURNING id, username, email, shareable_link, is_admin;
  `;
  const { rows } = await pool.query(query, [id, username, email, googleId, shareableLink]);
  return rows[0];
}

async function findByUsername(username) {
  const { rows } = await pool.query('SELECT id, username, shareable_link FROM users WHERE username = $1', [username]);
  return rows[0];
}

module.exports = { upsertProfile, findByUsername };
