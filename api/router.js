const express = require("express");
const router = express.Router();
const controller = require("./controller.js");

router.get("/events/recent", controller.getRecentEvents);
router.get("/events/:event_id", controller.getEvent);
router.post("/events", controller.postEvent);

router.get("/matches/topRated", controller.getTopRatedMatches);
router.post("/matches/:match_id/ratings", controller.postRating);
router.delete("/matches/:match_id/ratings", controller.deleteUserRating);

router.get("/search", controller.getSearchResults);

router.get("/promotions", controller.getPromotions);

router.get("/users/:user_id/ratings", controller.getUsersRatedMatches);

router.get("/users/:user_id", controller.getUsername);
router.post("/users", controller.createUser);
router.put("/users/:user_id", controller.editUsername);

router.get("/users", controller.checkUsernames);
router.delete("/users", controller.deleteUser);

router.get("/wrestlers/:wrestler_id", controller.getWrestlerMatches);

router.get("/info", controller.getInfo);

module.exports = router;
