const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
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
