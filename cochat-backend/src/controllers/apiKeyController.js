// Logic for saving/retrieving encrypted keys

const { insertApiKey, getAllEncryptedKeys } = require("../db/queries");

const storeApiKey = async (req, res) => {
    const { room_id, api_key } = req.body;

    if (!room_id || !api_key) {
        return res.status(400).json({ error: "room_id and api_key are required." });
    }

    try {
        await insertApiKey(room_id, api_key);
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
