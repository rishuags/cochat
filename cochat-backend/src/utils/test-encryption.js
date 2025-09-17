require('dotenv').config();
const { encrypt, decrypt } = require('../utils/encryption');

const secret = process.env.ENCRYPTION_SECRET;
const apiKey = 'sk-abc1234-secret-key';

const encrypted = encrypt(apiKey, secret);
console.log('Encrypted:', encrypted);

const decrypted = decrypt(encrypted, secret);
console.log('Decrypted:', decrypted);


//test: node src/utils/test-encryption.js (in cochat backend terminal)