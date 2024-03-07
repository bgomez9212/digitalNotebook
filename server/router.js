const express = require("express");
const router = express.Router();
const controller = require("./controller.js");

router.get("/events/", controller.getEvent);
router.get("/recentevents", controller.getRecentEvents);
router.get("/topMatches", controller.getTopRatedMatches);

module.exports = router;
