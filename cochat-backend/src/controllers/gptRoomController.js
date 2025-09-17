const { OpenAI } = require("openai");
const { getEncryptedKeyByRoomId } = require("../db/queries");
const { decrypt } = require("../utils/encryption");

const secret = process.env.ENCRYPTION_SECRET;

async function handleRoomGPTRequest(req, res) {
    const { room_id, messages } = req.body;

    if (!room_id || !messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "room_id and messages are required." });
    }

    if (!secret) {
        return res.status(500).json({ error: "Encryption secret not configured." });
    }

    try {
        const result = await getEncryptedKeyByRoomId(room_id);

        if (!result || !result.rows || result.rows.length === 0) {
            return res.status(404).json({ error: "API key not found for this room." });
        }

        const encryptedKey = result.rows[0].encrypted_key;
        const apiKey = decrypt(encryptedKey, secret);

        const openai = new OpenAI({ apiKey });

        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-4.1-nano-2025-04-14",
            messages,
            temperature: 0.7,
        });

        const gptReply = chatCompletion.choices[0].message;
        res.status(200).json({ reply: gptReply });

    } catch (error) {
        console.error("Error in GPT Room controller:", error);
        res.status(500).json({ error: "Failed to process GPT request." });
    }
}

module.exports = { handleRoomGPTRequest };