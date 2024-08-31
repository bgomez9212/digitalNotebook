const express = require("express");
const router = express.Router();
const controller = require("./controller.js");

router.get("/events", controller.getEvent);
router.post("/events", controller.postEvent);
router.get("/events/recent", controller.getRecentEvents);

router.get("/matches", controller.getMatchInfo);
router.get("/matches/topRated", controller.getTopRatedMatches);

// router.get("/ratings/:user_id/:match_id", controller.getUserRating);
router.get("/ratings", controller.getUsersRatedMatches);
router.post("/ratings", controller.postRating);
router.delete("/ratings", controller.deleteUserRating);

router.get("/search", controller.getSearchResults);

router.get("/promotions", controller.getPromotions);

router.get("/users", controller.checkUsernames);
router.post("/users", controller.createUser);
router.delete("/users", controller.deleteUser);
router.get("/users/usernames", controller.getUsername);
router.put("/users/usernames", controller.editUsername);

module.exports = router;
