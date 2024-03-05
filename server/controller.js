const model = require("./model.js");

module.exports = {
  getEvents: async (req, res) => {
    const result = await model.getEvents();
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
