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
    const { rows: matches } = await pool.query(
      `
      SELECT
        matches.id AS match_id,
        participants.team,
        wrestlers.name,
        AVG(ratings.rating) AS rating,
        (SELECT count(*) FROM ratings WHERE ratings.match_id = matches.id) AS submissions
      FROM matches
      JOIN participants ON participants.match_id = matches.id
      JOIN wrestlers ON wrestlers.id = participants.wrestler_id
      LEFT OUTER JOIN ratings ON ratings.match_id = matches.id
      WHERE matches.event_id = 1
      GROUP BY matches.id, participants.team, wrestlers.name
      ORDER BY matches.match_number, participants.team`
    );
    let matchArr = [];
    let matchObj = {
      match_id: matches[0].match_id,
      teams: [[matches[0].name]],
      rating: matches[0].rating,
      submissions: matches[0].submissions,
    };
    for (let i = 1; i < matches.length; i++) {
      let currentPartObj = matches[i];
      if (currentPartObj.match_id === matchObj.match_id) {
        if (matchObj.teams[currentPartObj.team]) {
          matchObj.teams[currentPartObj.team].push(currentPartObj.name);
        } else {
          matchObj.teams[currentPartObj.team] = [currentPartObj.name];
        }
      } else {
        matchArr.push({ ...matchObj });
        matchObj.match_id = currentPartObj.match_id;
        matchObj.teams = [[currentPartObj.name]];
        matchObj.rating = currentPartObj.rating;
        matchObj.submissions = currentPartObj.rating;
      }
      if (i === matches.length - 1) {
        matchArr.push({ ...matchObj });
      }
    }
    eventInfo[0].matches = matchArr;
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

    const { rows: results } = await pool.query(
      `
      SELECT
        participants.match_id,
        participants.team,
        wrestlers.name,
        AVG(ratings.rating) AS rating,
        matches.event_id
      FROM participants
      JOIN wrestlers ON participants.wrestler_id = wrestlers.id
      JOIN matches ON participants.match_id = matches.id
      JOIN events ON events.id = matches.event_id
      JOIN ratings ON ratings.match_id = matches.id
      WHERE participants.match_id IN (
        SELECT matches.id FROM matches
        JOIN events ON matches.event_id = events.id
        JOIN ratings ON ratings.match_id = matches.id
        WHERE events.date > $1::DATE AND rating IS NOT NULL
        GROUP BY matches.id, events.date
        ORDER BY (AVG(ratings.rating)) DESC, events.date DESC
        LIMIT 5
      )
      GROUP BY participants.match_id, participants.team, wrestlers.name, matches.event_id, events.date
      ORDER BY rating DESC, participants.match_id, team;
      `,
      [lastMonth]
    );
    let matchesArr = [];
    let matchObj = {
      event_id: results[0].event_id,
      match_id: results[0].match_id,
      rating: results[0].rating,
      teams: [[results[0].name]],
    };
    // skip first entry since that is manually inserted
    for (let i = 1; i < results.length; i++) {
      const participantObj = results[i];
      if (participantObj.match_id === matchObj.match_id) {
        if (matchObj.teams[participantObj.team]) {
          matchObj.teams[participantObj.team].push(participantObj.name);
        } else {
          matchObj.teams[participantObj.team] = [participantObj.name];
        }
      } else {
        matchesArr.push({ ...matchObj });
        matchObj.event_id = participantObj.event_id;
        matchObj.match_id = participantObj.match_id;
        matchObj.rating = participantObj.rating;
        matchObj.teams = [[participantObj.name]];
      }
      if (i === results.length - 1) {
        matchesArr.push({ ...matchObj });
      }
    }
    return matchesArr;
  },
  getMatchInfo: async (match_id) => {
    const { rows: result } = await pool.query(
      `
      SELECT
        matches.id,
        participants.team,
        wrestlers.name,
        AVG(ratings.rating) AS rating,
        (SELECT COUNT(*) FROM ratings WHERE ratings.match_id = matches.id) AS rating_count
      FROM matches
      JOIN participants ON matches.id = participants.match_id
      JOIN wrestlers ON participants.wrestler_id = wrestlers.id
      JOIN ratings ON matches.id = ratings.match_id
        WHERE matches.id = $1
      GROUP BY matches.id, participants.team, wrestlers.name
      ORDER BY participants.team ASC`,
      [match_id]
    );
    let matchObj = {
      id: result[0].id,
      rating: Math.ceil(result[0].rating * 100) / 100,
      rating_count: result[0].rating_count,
      teams: [],
    };
    for (let i = 0; i < result.length; i++) {
      let currentWrestlerObj = result[i];
      let team = currentWrestlerObj.team;
      if (!matchObj.teams[team]) {
        matchObj.teams[team] = [currentWrestlerObj.name];
      } else {
        matchObj.teams[team].push(currentWrestlerObj.name);
      }
    }
    return matchObj;
  },
};
