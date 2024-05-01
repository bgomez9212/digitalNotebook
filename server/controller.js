const model = require("./model.js");

module.exports = {
  getEvent: async (req, res) => {
    const result = await model.getEvent(req.query.event_id);
    res.send(result[0]).status(200);
  },
  getRecentEvents: async (req, res) => {
    const result = await model.getRecentEvents(req.query.numOfResults);
    res.send(result).status(200);
  },
  getTopRatedMatches: async (req, res) => {
    try {
      const result = await model.getTopRatedMatches(req.query.numOfMatches);
      res.send(result).status(200);
    } catch (err) {
      res.sendStatus(404);
    }
  },
  getMatchInfo: async (req, res) => {
    const result = await model.getMatchInfo(req.query.match_id);
    res.send(result[0]).status(200);
  },
  postRating: async (req, res) => {
    const result = await model.postRating(
      req.body.match_id,
      req.body.user_id,
      req.body.rating
    );
    res.sendStatus(201);
  },
  getUserRating: async (req, res) => {
    const result = await model.getUserRating(
      req.query.user_id,
      req.query.match_id
    );
    res.send(result[0]).status(200);
  },
  deleteUserRating: async (req, res) => {
    const result = await model.deleteUserRating(
      req.query.user_id,
      req.query.match_id
    );
    res.sendStatus(204);
  },
  getSearchResults: async (req, res) => {
    try {
      const result = await model.getSearchResults(
        req.query.search_param,
        req.query.search_text
      );
      res.send(result).status(200);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getUserRatings: async (req, res) => {
    try {
      const results = await model.getUserRatings(req.query.user_id);
      res.send(results).status(200);
    } catch (err) {
      res.send(err).status(500);
    }
  },
  getPromotions: async (req, res) => {
    try {
      const results = await model.getPromotions();
      res.send(results).status(200);
    } catch (err) {
      res.send(err).status(500);
    }
  },
};
