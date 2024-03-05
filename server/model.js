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
  getTopRatedMatches: async () => {
    const matchesArr = [];
    const { rows: results } = await pool.query(
      `
        SELECT participants.match_id, participants.team, wrestlers.name, matches.rating FROM participants
        JOIN wrestlers ON participants.wrestler_id = wrestlers.id
        JOIN matches ON participants.match_id = matches.id
        WHERE match_id IN (
          SELECT matches.id FROM matches
          JOIN events ON matches.event_id = events.id
          WHERE events.date > '2024-02-22'::DATE
          ORDER BY rating DESC
          LIMIT 5
        );
      `
    );
    for (let matchData of results) {
    }
  },
};

// [
//   {
//     match_id: 10,
//     rating: 5,
//     wrestlers:
//     [
//       ["Chris Jericho"],
//       ["Atlantis Jr"]
//     ]
//   },
//   {
//     match_id: 5,
//     rating: 5,
//     wrestlers:
//     [
//       [
//         "Anthony Bowens",
//         "Austin Gunn",
//         "Max Caster"
//       ],
//       [
//         "Alex Reynolds",
//         "Evil Uno",
//         "John Silver"
//       ]
//     ]
//   }
// ]
