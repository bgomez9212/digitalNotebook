const express = require("express");
const router = express.Router();
const controller = require("./controller.js");

router.get("/events/recent", controller.getRecentEvents);
router.get("/events/:event_id", controller.getEvent);

router.get("/matches/topRated", controller.getTopRatedMatches);
router.get("/matches/:match_id", controller.getMatchInfo);

router.post("/ratings/:match_id", controller.postRating);

module.exports = router;
