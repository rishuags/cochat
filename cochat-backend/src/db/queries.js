// All SQL Queries 

const pool = require("./dbclient");

const insertApiKey = async (room_id, encrypted_key) => {
    const query = `
        INSERT INTO api_keys (room_id, encrypted_key)
        VALUES ($1, $2)
        ON CONFLICT (room_id)
        DO UPDATE SET encrypted_key = EXCLUDED.encrypted_key
    `;
    await pool.query(query, [room_id, encrypted_key]);
};


const getAllEncryptedKeys = async () => {
    const query = `
       SELECT room_id, encrypted_key, created_at FROM api_keys ORDER BY created_at DESC;
    `;
    const result = await pool.query(query);
    return result;
};

const getEncryptedKeyByRoomId = async (room_id) => {
    const query = `
        SELECT encrypted_key FROM api_keys
        WHERE room_id = $1
    `;
    return await pool.query(query, [room_id]);
};



module.exports = { insertApiKey, getAllEncryptedKeys, getEncryptedKeyByRoomId };