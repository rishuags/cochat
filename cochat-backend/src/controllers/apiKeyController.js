// Logic for saving/retrieving encrypted keys

const { insertApiKey, getAllEncryptedKeys } = require("../db/queries");
const { encrypt } = require("../utils/encryption");
const secret = process.env.ENCRYPTION_SECRET;

if (!secret) {
    console.error("ENCRYPTION_SECRET is not set in environment variables.");
    return res.status(500).json({ error: "Encryption secret is not configured." });
}

const storeApiKey = async (req, res) => {
    const { room_id, api_key } = req.body;

    if (!room_id || !api_key) {
        return res.status(400).json({ error: "room_id and api_key are required." });
    }

    try {
        const encryptedKey = encrypt(api_key, secret);
        await insertApiKey(room_id, encryptedKey);
        res.status(201).json({ message: "API key stored successfully." });
    } catch (error) {
        console.error("Failed to store API key:", error);
        res.status(500).json({ error: "Failed to store API key." });
    }
};

const getAllStoredKeys = async function (req, res) {
    try {
        const result = await getAllEncryptedKeys();

        // console.log("🔥 Hit /api/retrieve-key-view");
        // console.log("🔐 Result:", result.rows);

        res.status(200).json({ keys: result.rows });
    } catch (error) {
        console.error("Error retrieving stored keys:", error);
        res.status(500).json({ error: "Could not retrieve keys" });
    }
}

module.exports = { storeApiKey, getAllStoredKeys };
