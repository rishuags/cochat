// GPT interaction logic 

// controllers/gptController.js
const { OpenAI } = require("openai");

async function handleGPTRequest(req, res) {
    const { apiKey, messages } = req.body;

    if (!apiKey || !messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid request body." });
    }

    try {
        const openai = new OpenAI({ apiKey });

        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-4.1-nano-2025-04-14",
            messages,
            temperature: 0.7,
        });

        const gptReply = chatCompletion.choices[0].message;
        res.status(200).json({ reply: gptReply });

    } catch (error) {
        console.error("OpenAI API error:", error);
        res.status(500).json({ error: "GPT request failed." });
    }
}

module.exports = { handleGPTRequest };