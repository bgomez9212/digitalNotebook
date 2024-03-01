const express = require("express");
const router = express.Router();
const controller = require("./controller.js");

router.get("/events", controller.getEvents);
router.get("/hello", controller.sendHelloWorld);

module.exports = router;
