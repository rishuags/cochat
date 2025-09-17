// AES-256 / crypto logic 

//Encryt API Key  -> use in 
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const ivLength = 16; // 16 bytes for AES-CBC

function encrypt(text, secret) {
    const iv = crypto.randomBytes(ivLength);
    const key = crypto.scryptSync(secret, 'salt', 32); // derive 256-bit key
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`;
}


//Decrypt API Key 
function decrypt(encryptedText, secret) {
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const key = crypto.scryptSync(secret, 'salt', 32);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}


module.exports = { encrypt, decrypt };