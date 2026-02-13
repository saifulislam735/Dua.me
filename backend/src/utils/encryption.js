const crypto = require('crypto');

const algorithm = 'aes-256-gcm';

function getKey() {
  return crypto.createHash('sha256').update(process.env.JWT_SECRET || 'dev-secret').digest();
}

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

function isValidHex(str) {
  return (
    typeof str === 'string' &&
    str.length > 0 &&
    str.length % 2 === 0 &&
    /^[0-9a-fA-F]+$/.test(str)
  );
}

function decrypt(payload) {
  if (typeof payload !== 'string') {
    throw new Error('Invalid encrypted payload: expected string');
  }

  const parts = payload.split(':');
  if (parts.length !== 3 || parts.some((part) => !part)) {
    throw new Error('Invalid encrypted payload format');
  }

  const [ivHex, tagHex, encryptedHex] = parts;

  if (!isValidHex(ivHex) || !isValidHex(tagHex) || !isValidHex(encryptedHex)) {
    throw new Error('Invalid encrypted payload encoding');
  }

  try {
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, getKey(), iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);
    return decrypted.toString('utf8');
  } catch (err) {
    throw new Error('Failed to decrypt payload');
  }
}

module.exports = { encrypt, decrypt };
