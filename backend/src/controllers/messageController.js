const Message = require('../models/Message');
const Report = require('../models/Report');
const User = require('../models/User');
const { pool } = require('../config/db');
const { encrypt, decrypt } = require('../utils/encryption');

function getSocket(req) {
  return req.app.get('io');
}

async function sendMessage(req, res) {
  const receiver = await User.findByUsername(req.params.username);
  if (!receiver) return res.status(404).json({ error: 'Receiver not found' });

  const text = (req.body.text || '').trim();
  const template = req.body.template || null;
  if (!text) return res.status(400).json({ error: 'Message text is required' });
  if (text.length > 1200) return res.status(400).json({ error: 'Message too long (max 1200 chars)' });

  const message = await Message.createMessage({ receiverId: receiver.id, text: encrypt(text), template });
  await pool.query('INSERT INTO sender_logs (message_id, sender_ip) VALUES ($1,$2)', [message.id, req.ip || null]);

  getSocket(req).to(`inbox:${receiver.id}`).emit('newMessage', { id: message.id, createdAt: message.created_at });

  return res.status(201).json({ ok: true, id: message.id });
}

async function getInbox(req, res) {
  const messages = await Message.listInbox(req.user.sub);
  const decoded = messages.map((m) => ({ ...m, text: decrypt(m.text) }));
  return res.json(decoded);
}

async function replyMessage(req, res) {
  const reply = (req.body.reply || '').trim();
  if (!reply) return res.status(400).json({ error: 'Reply is required' });
  const updated = await Message.replyToMessage(req.params.id, req.user.sub, reply);
  if (!updated) return res.status(404).json({ error: 'Message not found' });
  return res.json(updated);
}

async function reportMessage(req, res) {
  const report = await Report.createReport({
    messageId: req.params.id,
    reporterId: req.user.sub,
    reason: req.body.reason || 'abusive'
  });
  return res.status(201).json(report);
}

module.exports = { sendMessage, getInbox, replyMessage, reportMessage };
