const pool = require("./db.js");

module.exports = {
  getEvents: async () => {
    const { rows: results } = await pool.query(
      `SELECT events.id AS id, events.title, events.date, events.venue_id, promotions.name AS promotion_name
      FROM events
      JOIN promotions ON promotions.id = events.promotion_id
      ORDER BY date ASC
      LIMIT 5;`
    );
    return results;
  },
  sendHelloWorld: async () => {
    return "Hello World";
  },
};
