const test = require('node:test');
const assert = require('node:assert/strict');
const { encrypt, decrypt } = require('../src/utils/encryption');

test('encrypt and decrypt text', () => {
  const text = 'anonymous dua';
  const encrypted = encrypt(text);
  assert.notEqual(encrypted, text);
  assert.equal(decrypt(encrypted), text);
});
