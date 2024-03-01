const express = require("express");
const router = express.Router();
const controller = require("./controller.js");

router.get("/events", controller.getEvents);

module.exports = router;
