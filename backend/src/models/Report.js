const { pool } = require('../config/db');

async function createReport({ messageId, reporterId, reason }) {
  const { rows } = await pool.query(
    'INSERT INTO reports (message_id, reporter_id, reason, resolved) VALUES ($1, $2, $3, false) RETURNING *',
    [messageId, reporterId, reason]
  );
  return rows[0];
}

async function listOpenReports() {
  const { rows } = await pool.query('SELECT * FROM reports WHERE resolved = false ORDER BY id DESC');
  return rows;
}

module.exports = { createReport, listOpenReports };
