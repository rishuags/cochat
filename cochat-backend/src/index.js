const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); // So we can read JSON bodies in POST requests

app.get("/", (req, res) => {
    res.send("CoChat backend is alive. Probably.");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
