const model = require("./model.js");

module.exports = {
  getEvent: async (req, res) => {
    const result = await model.getEvent(req.query.event_id);
    res.send(result[0]).status(200);
  },
  getRecentEvents: async (req, res) => {
    const result = await model.getRecentEvents();
    res.send(result).status(200);
  },
  getTopRatedMatches: async (req, res) => {
    try {
      const result = await model.getTopRatedMatches();
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
      req.query.match_id,
      req.query.user_id,
      req.query.rating
    );
    res.sendStatus(201);
  },
};
