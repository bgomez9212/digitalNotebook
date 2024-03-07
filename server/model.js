const pool = require("./db.js");

module.exports = {
  getEvent: async (eventId) => {
    const { rows: eventInfo } = await pool.query(
      `SELECT
        events.title AS title,
        TO_CHAR(events.date, 'YYYY-MM-DD') AS date,
        promotions.name AS promotion_name,
        venues.name AS venue_name
      FROM events
      JOIN promotions ON events.promotion_id = promotions.id
      JOIN venues ON events.venue_id = venues.id
      WHERE events.id = $1`,
      [eventId]
    );
    eventInfo[0].matches = [];
    const { rows: matches } = await pool.query(
      `
      SELECT
        matches.match_number,
        matches.rating AS rating,
        participants.team,
        wrestlers.name
      FROM matches
      JOIN participants ON participants.match_id = matches.id
      JOIN wrestlers ON wrestlers.id = participants.wrestler_id
      WHERE matches.event_id = $1
      ORDER BY matches.match_number, participants.team`,
      [eventId]
    );
    let matchesArr = [];
    // create separate match obj that will be pushed to matchesArr
    // start with first element of inputArr (arr)
    let matchObj = {
      match_number: matches[0].match_number,
      rating: matches[0].rating,
      wrestler: [[matches[0].name]],
    };
    // starting at index one
    for (let i = 1; i < matches.length; i++) {
      // name iteration
      const currentPartObj = matches[i];
      // if the current iteration's match number matches the current match obj match number
      if (currentPartObj.match_number === matchObj.match_number) {
        // and if the current iterations team matches the matchObj wrestlers team
        if (matchObj.wrestler[currentPartObj.team]) {
          matchObj.wrestler[currentPartObj.team].push(currentPartObj.name);
        } else {
          matchObj.wrestler.push([currentPartObj.name]);
        }
      } else {
        matchesArr.push({ ...matchObj });
        matchObj.match_number = currentPartObj.match_number;
        matchObj.rating = currentPartObj.rating;
        matchObj.wrestler = [[currentPartObj.name]];
      }
    }
    eventInfo[0].matches = matchesArr;
    // return matchesArr;
    return eventInfo;
  },
  getRecentEvents: async () => {
    const { rows: results } = await pool.query(
      `SELECT
        events.id AS id,
        events.title,
        TO_CHAR(events.date, 'YYYY-MM-DD') AS date,
        events.venue_id,
        promotions.name AS promotion_name
      FROM events
      JOIN promotions ON promotions.id = events.promotion_id
      ORDER BY date DESC
      LIMIT 5;`
    );
    return results;
  },
  getTopRatedMatches: async () => {
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let lastMonth = `${year}-${month}-${day}`;

    const matchesArr = [];
    const { rows: results } = await pool.query(
      `
      SELECT
        participants.match_id,
        participants.team,
        wrestlers.name,
        matches.rating,
        matches.event_id,
        events.date
      FROM participants
      JOIN wrestlers ON participants.wrestler_id = wrestlers.id
      JOIN matches ON participants.match_id = matches.id
      JOIN events ON events.id = matches.event_id
      WHERE match_id IN (
        SELECT matches.id FROM matches
        JOIN events ON matches.event_id = events.id
        WHERE events.date > $1::DATE
        ORDER BY matches.rating DESC, events.date DESC
        LIMIT 5
      )
      ORDER BY matches.rating DESC, date DESC, matches.id, team;
      `,
      [lastMonth]
    );
    let matchObj = {
      event_id: results[0].event_id,
      match_id: results[0].match_id,
      rating: results[0].rating,
      wrestlers: [[results[0].name]],
    };
    // skip first entry since that is manually inserted
    for (let matchData of results.slice(1, results.length)) {
      if (matchObj.match_id === matchData.match_id) {
        if (matchObj.wrestlers[matchData.team]) {
          matchObj.wrestlers[matchData.team].push(matchData.name);
        } else {
          matchObj.wrestlers[matchData.team] = [matchData.name];
        }
      } else {
        matchesArr.push({ ...matchObj });
        matchObj.event_id = matchData.event_id;
        matchObj.match_id = matchData.match_id;
        matchObj.rating = matchData.rating;
        matchObj.wrestlers = [[matchData.name]];
      }
      if (results.indexOf(matchData) === results.length - 1) {
        matchesArr.push({ ...matchObj });
      }
    }
    return matchesArr;
  },
};
