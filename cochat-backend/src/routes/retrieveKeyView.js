// GET /api/retrieve-key-view

// routes/retrieveKeyView.js
const express = require("express");
const router = express.Router();

const { getAllStoredKeys } = require("../controllers/apiKeyController");
const basicAuth = require("../middleware /auth");

router.get("/retrieve-key-view", basicAuth, getAllStoredKeys);

module.exports = router;