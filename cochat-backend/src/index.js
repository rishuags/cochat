require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const corsOrigin = process.env.CLIENT_ORIGIN;


// console.log("DB ENV:", process.env.DATABASE_URL);
console.log("PORT:", PORT);

const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});



app.get("/test-db", async (req, res) => {
    try {
        // const result = await pool.query("SELECT NOW()");
        // res.json({ time: result.rows[0] });
        console.log("Trying to connect to DB...");
        const client = await pool.connect();
        console.log("✅ Connected!");
        const result = await client.query("SELECT NOW()");
        console.log("Server time is:", result.rows[0]);

        res.json({
            message: "DB connected ✅",
            serverTime: result.rows[0].now
        });

        client.release();
    } catch (err) {
        console.error("DB connection failed:", err);
        res.status(500).send("Nope.");
    }
});

console.log("Allowed origin from env:", corsOrigin);
app.use(cors({
    origin: corsOrigin,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json()); // So we can read JSON bodies in POST requests

const { OpenAI } = require("openai");

app.post("/api/gpt", async (req, res) => {
    const { apiKey, messages } = req.body;

    if (!apiKey || !messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid request body." });
    }

    try {
        const openai = new OpenAI({ apiKey });

        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-4.1-nano-2025-04-14",
            messages: messages,
            temperature: 0.7,
        });
        const gptReply = chatCompletion.choices[0].message;

        res.status(200).json({ reply: gptReply });

    } catch (error) {
        console.error("OpenAI API error:", error);
        res.status(500).json({ error: "GPT request failed." });
    }
})


app.get("/", (req, res) => {
    res.send("CoChat backend is alive. Probably.");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on ${PORT}`);
});
