const pool = require("./db.js");

module.exports = {
  getEvents: async () => {
    const { rows: results } = await pool.query(
      `SELECT * FROM events ORDER BY date DESC LIMIT 5`
    );
    return results;
  },
  sendHelloWorld: async () => {
    return "Hello World";
  },
};
