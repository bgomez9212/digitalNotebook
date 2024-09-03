const express = require("express");
const router = express.Router();
const controller = require("./controller.js");

// number optional query param
router.get("/events/recent", controller.getRecentEvents);
// user_id optional query param
router.get("/events/:event_id", controller.getEvent);
router.post("/events", controller.postEvent);

router.get("/matches/topRated", controller.getTopRatedMatches);
router.get("/matches", controller.getMatchInfo);

router.get("/ratings", controller.getUsersRatedMatches);
router.post("/ratings", controller.postRating);
router.delete("/ratings", controller.deleteUserRating);

router.get("/search", controller.getSearchResults);

router.get("/promotions", controller.getPromotions);

router.get("/users/usernames", controller.getUsername);
router.put("/users/usernames", controller.editUsername);
router.get("/users", controller.checkUsernames);
router.post("/users", controller.createUser);
router.delete("/users", controller.deleteUser);

module.exports = router;
