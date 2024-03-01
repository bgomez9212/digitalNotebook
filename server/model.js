const pool = require("./db.js");

module.exports = {
  getEvents: async () => {
    const { rows: results } = await pool.query(`SELECT * FROM events`);
    return results;
  },
  sendHelloWorld: async () => {
    return "Hello World";
  },
};
