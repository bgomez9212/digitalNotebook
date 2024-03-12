const express = require("express");
const router = express.Router();
const controller = require("./controller.js");

router.get("/events/:id", controller.getEvent);
router.get("/recentevents", controller.getRecentEvents);
router.get("/topMatches", controller.getTopRatedMatches);
router.get("/matches/:id", controller.getMatchInfo);

module.exports = router;
