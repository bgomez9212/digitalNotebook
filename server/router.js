const express = require("express");
const router = express.Router();
const controller = require("./controller.js");

// number - optional query param (number of results)
router.get("/events/recent", controller.getRecentEvents);
// user_id - optional query param (include specific user's ratings)
router.get("/events/:event_id", controller.getEvent);
router.post("/events", controller.postEvent);

// number - optional query param (number of matches)
router.get("/matches/topRated", controller.getTopRatedMatches);

router.get("/ratings/:user_id", controller.getUsersRatedMatches);
router.get("/ratings/:user_id/promotions", controller.getUserPromotions);
// body includes user_id and rating
router.post("/ratings/:match_id", controller.postRating);
// body includes user_id
router.delete("/ratings/:match_id", controller.deleteUserRating);
// query params - search_param, search_text, user_id
router.get("/search", controller.getSearchResults);

router.get("/promotions", controller.getPromotions);

router.get("/users/:user_id", controller.getUsername);
// body - username
router.put("/users/:user_id", controller.editUsername);
// username - query param
router.get("/users", controller.checkUsernames);
//
router.post("/users", controller.createUser);
router.delete("/users", controller.deleteUser);
// user_id - query param
router.get("/wrestlers/:wrestler_id", controller.getWrestlerMatches);

module.exports = router;
