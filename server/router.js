const express = require("express");
const router = express.Router();
const controller = require("./controller.js");

// number optional query param (number of results)
router.get("/events/recent", controller.getRecentEvents);
// user_id optional query param (include specific user's ratings)
router.get("/events/:event_id", controller.getEvent);
router.post("/events", controller.postEvent);

// number optional query param (number of matches)
router.get("/matches/topRated", controller.getTopRatedMatches);

router.get("/ratings/:user_id", controller.getUsersRatedMatches);
router.post("/ratings/:match_id", controller.postRating);
router.delete("/ratings/:match_id", controller.deleteUserRating);

router.get("/search", controller.getSearchResults);

router.get("/promotions", controller.getPromotions);

router.get("/users/usernames", controller.getUsername);
router.put("/users/usernames", controller.editUsername);
router.get("/users", controller.checkUsernames);
router.post("/users", controller.createUser);
router.delete("/users", controller.deleteUser);

module.exports = router;
