const { pool } = require('../config/db');

async function createMessage({ receiverId, text, template }) {
  const query = `
    INSERT INTO messages (receiver_id, text, template)
    VALUES ($1, $2, $3)
    RETURNING id, receiver_id, text, template, reply, created_at;
  `;
  const { rows } = await pool.query(query, [receiverId, text, template || null]);
  return rows[0];
}

async function listInbox(receiverId) {
  const { rows } = await pool.query(
    'SELECT id, text, template, reply, created_at FROM messages WHERE receiver_id = $1 ORDER BY created_at DESC',
    [receiverId]
  );
  return rows;
}

async function replyToMessage(id, receiverId, reply) {
  const { rows } = await pool.query(
    'UPDATE messages SET reply = $1 WHERE id = $2 AND receiver_id = $3 RETURNING id, reply',
    [reply, id, receiverId]
  );
  return rows[0];
}

module.exports = { createMessage, listInbox, replyToMessage };
