const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const ivLength = 16;

function encrypt(text, secret) {
    const iv = crypto.randomBytes(ivLength);
    const key = crypto.scryptSync(secret, "salt", 32);

    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return `${iv.toString("hex")}:${encrypted}`;
}

function decrypt(encryptedText, secret) {

    if (!encryptedText) {
        throw new Error("decrypt() received empty encryptedText");
    }

    const parts = encryptedText.split(":");

    if (parts.length !== 2) {
        throw new Error("Invalid encrypted text format");
    }

    const [ivHex, encrypted] = parts;

    const iv = Buffer.from(ivHex, "hex");
    const key = crypto.scryptSync(secret, "salt", 32);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}

module.exports = { encrypt, decrypt };