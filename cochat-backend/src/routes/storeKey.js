// POST /api/store-key

const express = require("express");
const router = express.Router();
const { storeApiKey } = require("../controllers/apiKeyController");

// Route: POST /api/store-key
router.post("/store-key", storeApiKey);

module.exports = router;