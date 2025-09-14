// DB connection logic 

const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// console.log("💡 Inside dbclient.js: Creating pool");
module.exports = pool;