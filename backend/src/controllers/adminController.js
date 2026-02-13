const { pool } = require('../config/db');
const { decrypt } = require('../utils/encryption');

async function getReports(_req, res) {
  const { rows } = await pool.query(`
    SELECT r.id, r.reason, r.created_at, r.message_id, r.reporter_id, m.text, m.receiver_id, sl.sender_ip
    FROM reports r
    JOIN messages m ON m.id = r.message_id
    LEFT JOIN sender_logs sl ON sl.message_id = m.id
    WHERE r.resolved = false
    ORDER BY r.id DESC
  `);

  const reports = rows.map((r) => ({ ...r, text: decrypt(r.text) }));
  return res.json(reports);
}

async function deleteUser(req, res) {
  await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
  return res.status(204).send();
}

async function deleteMessage(req, res) {
  await pool.query('DELETE FROM messages WHERE id = $1', [req.params.id]);
  return res.status(204).send();
}

module.exports = { getReports, deleteUser, deleteMessage };
