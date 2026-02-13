const Message = require('../models/Message');
const Report = require('../models/Report');
const User = require('../models/User');
const { encrypt } = require('../utils/encryption');

function getSocket(req) {
  return req.app.get('io');
}

async function sendMessage(req, res) {
  const receiver = await User.findByUsername(req.params.username);
  if (!receiver) {
    return res.status(404).json({ error: 'Receiver not found' });
  }

  const message = await Message.createMessage({
    receiverId: receiver.id,
    text: encrypt(req.body.text),
    template: req.body.template
  });

  getSocket(req).to(`inbox:${receiver.id}`).emit('message:new', { id: message.id, createdAt: message.created_at });

  return res.status(201).json({ ok: true, id: message.id });
}

async function getInbox(req, res) {
  const messages = await Message.listInbox(req.user.sub);
  return res.json(messages);
}

async function replyMessage(req, res) {
  const updated = await Message.replyToMessage(req.params.id, req.user.sub, req.body.reply);
  if (!updated) {
    return res.status(404).json({ error: 'Message not found' });
  }
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
