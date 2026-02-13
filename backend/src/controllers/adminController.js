const Report = require('../models/Report');
const { pool } = require('../config/db');

async function getReports(_req, res) {
  const reports = await Report.listOpenReports();
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
