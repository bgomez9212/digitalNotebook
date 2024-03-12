const express = require("express");
const router = express.Router();
const controller = require("./controller.js");

router.get("/events/recent", controller.getRecentEvents);
router.get("/events/:event_id", controller.getEvent);
router.get("/matches/:match_id", controller.getMatchInfo);
router.get("/matches/topRated", controller.getTopRatedMatches);

module.exports = router;
