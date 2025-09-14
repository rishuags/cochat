// 

// routes/gptRoutes.js
const express = require("express");
const router = express.Router();
const { handleGPTRequest } = require("../controllers/gptController");

router.post("/", handleGPTRequest);

module.exports = router;