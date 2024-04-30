const express = require("express");
const router = express.Router();
const controller = require("./controller.js");

router.get("/events/recent", controller.getRecentEvents);
router.get("/events/:event_id", controller.getEvent);

router.get("/matches/topRated", controller.getTopRatedMatches);
router.get("/matches/:match_id", controller.getMatchInfo);

router.post("/ratings/:match_id", controller.postRating);
router.get("/ratings/:user_id/:match_id", controller.getUserRating);
router.delete("/ratings/:user_id/:match_id", controller.deleteUserRating);
router.get("/ratings/:user_id", controller.getUserRatings);

router.get("/search/:search_param/:search_text", controller.getSearchResults);

router.get("/promotions", controller.getPromotions);

module.exports = router;
