const assert = require('assert');
const request = require('supertest');
const jwt = require('jsonwebtoken');

const db = require('../src/config/db');
const app = require('../src/app');
const User = require('../src/models/User');
const Message = require('../src/models/Message');
const Report = require('../src/models/Report');

function token(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret');
}

describe('messages flow', () => {
  beforeEach(() => {
    db.pool.query = async () => ({ rows: [] });
  });

  it('sends anonymous message', async () => {
    User.findByUsername = async () => ({ id: '11111111-1111-1111-1111-111111111111', username: 'receiver' });
    Message.createMessage = async () => ({ id: 7, created_at: new Date().toISOString() });

    const res = await request(app).post('/messages/send/receiver').send({ text: 'hello', template: 'Dua for health' });
    assert.equal(res.status, 201);
  });

  it('replies and reports with auth', async () => {
    Message.replyToMessage = async () => ({ id: 1, reply: 'thanks' });
    Report.createReport = async () => ({ id: 3 });

    const auth = `Bearer ${token({ sub: '11111111-1111-1111-1111-111111111111', isAdmin: false })}`;
    const replyRes = await request(app).post('/messages/reply/1').set('Authorization', auth).send({ reply: 'thanks' });
    assert.equal(replyRes.status, 200);

    const reportRes = await request(app).post('/messages/report/1').set('Authorization', auth).send({ reason: 'abusive' });
    assert.equal(reportRes.status, 201);
  });
});

describe('auth flow', () => {
  it('rejects bad magic link', async () => {
    db.pool.query = async () => ({ rows: [] });
    const res = await request(app).get('/auth/magic/verify?token=bad');
    assert.equal(res.status, 400);
  });
});
