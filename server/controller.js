const model = require("./model.js");

module.exports = {
  getEvent: async (req, res) => {
    try {
      const result = await model.getEvent(
        req.query.event_id,
        req.query.user_id
      );
      res.status(200).send(result[0]);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  getRecentEvents: async (req, res) => {
    try {
      const result = await model.getRecentEvents(req.query.numOfResults);
      res.status(200).send(result);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  getTopRatedMatches: async (req, res) => {
    try {
      const result = await model.getTopRatedMatches(
        req.query.numOfMatches,
        req.query.user_id
      );
      res.status(200).send(result);
    } catch (err) {
      res.status(404).send(err);
    }
  },
  getMatchInfo: async (req, res) => {
    try {
      const result = await model.getMatchInfo(req.query.match_id);
      res.status(200).send(result[0]);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  postRating: async (req, res) => {
    try {
      const result = await model.postRating(
        req.body.match_id,
        req.body.user_id,
        req.body.rating
      );
      res.sendStatus(201);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  getUserRating: async (req, res) => {
    try {
      const result = await model.getUserRating(
        req.query.user_id,
        req.query.match_id
      );
      res.status(200).send(result);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  deleteUserRating: async (req, res) => {
    try {
      const result = await model.deleteUserRating(
        req.query.user_id,
        req.query.match_id
      );
      res.sendStatus(204);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  getSearchResults: async (req, res) => {
    try {
      const result = await model.getSearchResults(
        req.query.search_param,
        req.query.search_text,
        req.query.user_id
      );
      res.send(result).status(200);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getUserRatings: async (req, res) => {
    try {
      const results = await model.getUserRatings(
        req.query.user_id,
        req.query.sort_params
      );
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
  checkUsernames: async (req, res) => {
    try {
      const results = await model.checkUsernames(req.query.user_name);
      res.send(results).status(200);
    } catch (err) {
      res.send(err).status(500);
    }
  },
  createUser: async (req, res) => {
    try {
      const results = await model.createUser(
        req.body.user_id,
        req.body.username
      );
      res.send(results).status(201);
    } catch (err) {
      res.send(err).status(500);
    }
  },
  getUsername: async (req, res) => {
    try {
      const results = await model.getUsername(req.query.user_id);
      res.send(results).status(200);
    } catch (err) {
      res.send(err).status(500);
    }
  },
  editUsername: async (req, res) => {
    try {
      const results = await model.editUsername(
        req.body.user_id,
        req.body.username
      );
      res.send(results).status(200);
    } catch (err) {
      res.send(err).status(500);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const results = await model.deleteUser(req.query.user_id);
      res.send(results).status(204);
    } catch (err) {
      res.send(err).status(404);
    }
  },
  postEvent: async (req, res) => {
    try {
      const result = await model.postEvent(req.body);
      res.status(201).send(result);
    } catch (err) {
      res.status(404).send(err.message);
    }
  },
};
