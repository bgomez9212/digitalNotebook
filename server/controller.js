const model = require("./model.js");

module.exports = {
  getEvent: async (req, res) => {
    try {
      const result = await model.getEvent(
        req.params.event_id,
        req.query.user_id
      );
      res.status(200).send(result[0]);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  getRecentEvents: async (req, res) => {
    try {
      const result = await model.getRecentEvents(req.query.number);
      res.status(200).send(result);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  getTopRatedMatches: async (req, res) => {
    try {
      const result = await model.getTopRatedMatches(
        req.query.number,
        req.query.user_id
      );
      res.status(200).send(result);
    } catch (err) {
      res.status(404).send(err);
    }
  },
  getUsersRatedMatches: async (req, res) => {
    try {
      const results = await model.getUsersRatedMatches(req.params.user_id);
      res.send(results).status(200);
    } catch (err) {
      res.send(err).status(500);
    }
  },
  postRating: async (req, res) => {
    try {
      const result = await model.postRating(
        req.params.match_id,
        req.body.user_id,
        req.body.rating
      );
      res.sendStatus(201);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  deleteUserRating: async (req, res) => {
    try {
      const result = await model.deleteUserRating(
        req.params.match_id,
        req.body.user_id
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
      const results = await model.getUsername(req.params.user_id);
      res.send(results).status(200);
    } catch (err) {
      res.send(err).status(500);
    }
  },
  editUsername: async (req, res) => {
    try {
      const results = await model.editUsername(
        req.params.user_id,
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
      console.log(err);
      if (
        err.message === "event already exists" ||
        err.message === "invalid API key"
      ) {
        res.status(400).send({ error: err.message });
      } else {
        res
          .status(500)
          .send({ error: "An error occurred while posting the event" });
      }
    }
  },
};
