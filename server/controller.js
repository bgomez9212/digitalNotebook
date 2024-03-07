const model = require("./model.js");

module.exports = {
  getEvent: async (req, res) => {
    console.log(req.query.id);
    res.send("hello").status(200);
  },
  getRecentEvents: async (req, res) => {
    const result = await model.getRecentEvents();
    res.send(result).status(200);
  },
  sendHelloWorld: async (req, res) => {
    const result = await model.sendHelloWorld();
    res.send(result).status(200);
  },
  getTopRatedMatches: async (req, res) => {
    const result = await model.getTopRatedMatches();
    res.send(result).status(200);
  },
};
