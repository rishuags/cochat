const express = require("express");
const router = express.Router();
const { handleRoomGPTRequest } = require("../controllers/gptRoomController");

router.post("/gpt-room", handleRoomGPTRequest);

module.exports = router;