const pool = require("./db.js");

function parseMatchData(matchArr) {
  let matchesArr = [];
  const matchObj = {
    match_id: matchArr[0].match_id,
    teams: [],
    championships: [],
    rating: matchArr[0].rating,
    rating_count: matchArr[0].rating_count,
  };

  for (const [i, partObj] of matchArr.entries()) {
    if (partObj.match_id !== matchObj.match_id) {
      matchesArr.push({ ...matchObj });
      matchObj.match_id = partObj.match_id;
      matchObj.teams = [];
      matchObj.championships = [];
      matchObj.rating = partObj.rating;
      rating_count = partObj.rating_count;
    }
    if (!matchObj.teams[partObj.team]) {
      matchObj.teams[partObj.team] = [];
    }
    if (!matchObj.teams[partObj.team].includes(partObj.wrestler_name)) {
      matchObj.teams[partObj.team].push(partObj.wrestler_name);
    }

    if (!matchObj.championships.flat().includes(partObj.championship_name)) {
      matchObj.championships.push([partObj.championship_name]);
    }
    if (i === matchArr.length - 1) {
      matchesArr.push({ ...matchObj });
    }
  }

  return matchesArr;
}

module.exports = {
  getEvent: async (eventId) => {
    const { rows: eventInfo } = await pool.query(
      `SELECT
        events.title AS title,
        TO_CHAR(events.date, 'YYYY-MM-DD') AS date,
        promotions.name AS promotion_name,
        venues.name AS venue_name,
        venues.city,
        venues.state,
        venues.country
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
        wrestlers.name AS wrestler_name,
        AVG(ratings.rating) AS rating,
        (SELECT COUNT(*) FROM ratings WHERE ratings.match_id = matches.id) AS rating_count,
        championships.name AS championship_name
      FROM matches
      JOIN participants ON matches.id = participants.match_id
      JOIN wrestlers ON participants.wrestler_id = wrestlers.id
      LEFT OUTER JOIN ratings ON matches.id = ratings.match_id
      LEFT OUTER JOIN matches_championships ON matches_championships.match_id = matches.id
      LEFT OUTER JOIN championships ON matches_championships.championship_id = championships.id
        WHERE matches.event_id = $1
      GROUP BY matches.id, participants.team, wrestlers.name, matches_championships.id, championships.name
      ORDER BY matches.match_number, participants.team ASC`,
      [eventId]
    );
    eventInfo[0].matches = parseMatchData(matches);
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
    if (month === 0) {
      month = 12; // December of the previous year
      year--; // Adjust the year accordingly
    }
    let year = date.getFullYear();
    let lastMonth = `${year}-${month}-${day}`;

    const { rows: results } = await pool.query(
      `
      SELECT
        matches.id AS match_id,
        participants.team,
        wrestlers.name AS wrestler_name,
        AVG(ratings.rating) AS rating,
        (SELECT COUNT(*) FROM ratings WHERE ratings.match_id = matches.id) AS rating_count,
        championships.name AS championship_name
      FROM matches
      JOIN participants ON matches.id = participants.match_id
      JOIN wrestlers ON participants.wrestler_id = wrestlers.id
      LEFT OUTER JOIN ratings ON matches.id = ratings.match_id
      LEFT OUTER JOIN matches_championships ON matches_championships.match_id = matches.id
      LEFT OUTER JOIN championships ON matches_championships.championship_id = championships.id
        WHERE matches.id IN (
        SELECT matches.id FROM matches
        JOIN events ON matches.event_id = events.id
        JOIN ratings ON ratings.match_id = matches.id
        WHERE events.date > $1::DATE AND rating IS NOT NULL
        GROUP BY matches.id, events.date
        ORDER BY (AVG(ratings.rating)) DESC, events.date DESC
        LIMIT 5
      )
      GROUP BY matches.id, participants.team, wrestlers.name, championship_name, participants.match_id
      ORDER BY rating DESC, participants.match_id, team;
      `,
      [lastMonth]
    );
    return parseMatchData(results);
  },
  getMatchInfo: async (match_id) => {
    const { rows: result } = await pool.query(
      `
      SELECT
        matches.id AS match_id,
        participants.team,
        wrestlers.name AS wrestler_name,
        AVG(ratings.rating) AS rating,
        (SELECT COUNT(*) FROM ratings WHERE ratings.match_id = matches.id) AS rating_count,
        championships.name AS championship_name
      FROM matches
      JOIN participants ON matches.id = participants.match_id
      JOIN wrestlers ON participants.wrestler_id = wrestlers.id
      LEFT OUTER JOIN ratings ON matches.id = ratings.match_id
      LEFT OUTER JOIN matches_championships ON matches_championships.match_id = matches.id
      LEFT OUTER JOIN championships ON matches_championships.championship_id = championships.id
        WHERE matches.id = $1
      GROUP BY matches.id, participants.team, wrestlers.name, matches_championships.id, championships.name
      ORDER BY participants.team ASC;`,
      [match_id]
    );
    return parseMatchData(result);
  },
  postRating: async (match_id, user_id, rating) => {
    const { rows: results } = await pool.query(
      "INSERT INTO ratings (user_id, match_id, rating) VALUES ($1, $2, $3) ON CONFLICT (match_id, user_id) DO UPDATE SET rating = $3",
      [user_id, match_id, rating]
    );
    return results;
  },
};
