const model = require("./model.js");

module.exports = {
  getEvents: async (req, res) => {
    const result = await model.getEvents();
    res.send(result).status(200);
  },
};
