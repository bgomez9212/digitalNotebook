const express = require("express");
const router = express.Router();
const controller = require("./controller.js");

router.get("/events/recent", controller.getRecentEvents);
router.get("/events/:event_id", controller.getEvent);
router.post("/events/", controller.postEvent);

router.get("/matches/topRated", controller.getTopRatedMatches);
router.get("/matches/:match_id", controller.getMatchInfo);

router.post("/ratings/:match_id", controller.postRating);
router.get("/ratings/:user_id/:match_id", controller.getUserRating);
router.delete("/ratings/:user_id/:match_id", controller.deleteUserRating);
router.get("/ratings/:user_id", controller.getUsersRatedMatches);

router.get("/search/:search_param/:search_text", controller.getSearchResults);

router.get("/promotions", controller.getPromotions);

router.get("/users", controller.checkUsernames);
router.get("/users/:user_id", controller.getUsername);
router.post("/users", controller.createUser);
router.put("/users/:user_id", controller.editUsername);
router.delete("/users/:user_id", controller.deleteUser);

module.exports = router;
