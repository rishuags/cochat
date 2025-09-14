require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const corsOrigin = process.env.CLIENT_ORIGIN;


// console.log("DB ENV:", process.env.DATABASE_URL);
console.log("PORT:", PORT);
console.log("Allowed origin from env:", corsOrigin);

app.use(cors({
    origin: corsOrigin,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json()); // So we can read JSON bodies in POST requests


// DB test route 

const pool = require("./db/dbclient");
// console.log("Pool ready?", !!pool.query); // Should be true
// console.log("Pool", pool);
// console.log("Pool total count", pool.totalCount);
app.get("/test-db", async (req, res) => {
    try {
        // const result = await pool.query("SELECT NOW()");
        // res.json({ time: result.rows[0] });
        console.log("Trying to connect to DB...");
        const client = await pool.connect();

        // console.log("✅ Connected!");
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

// Route to communicate with GPT
const gptRoutes = require("./routes/gptRouter");
app.use("/api/gpt", gptRoutes);

//Route to store key in database
const storeKeyRoutes = require("./routes/storeKey");
app.use("/api", storeKeyRoutes);


// Route to see all keys in database
if (process.env.NODE_ENV !== "production") {

    const retrieveKeyViewRouter = require("./routes/retrieveKeyView");
    app.use("/api", retrieveKeyViewRouter);
}

// Root
app.get("/", (req, res) => {
    res.send("CoChat backend is alive. Probably.");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on ${PORT}`);
});
