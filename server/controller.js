const model = require("./model.js");

module.exports = {
  getEvent: async (req, res) => {
    const result = await model.getEvent(req.query.id);
    res.send(result[0]).status(200);
  },
  getRecentEvents: async (req, res) => {
    const result = await model.getRecentEvents();
    res.send(result).status(200);
  },
  getTopRatedMatches: async (req, res) => {
    const result = await model.getTopRatedMatches();
    res.send(result).status(200);
  },
};
