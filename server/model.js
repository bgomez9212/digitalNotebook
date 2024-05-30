const pool = require("./db.js");

function formatData(obj) {
  const matchObj = { ...obj };
  matchObj.championships = obj.championships.join(" & ");
  matchObj.participants = obj.participants
    .map((participantsList, i) => participantsList.join(" & "))
    .join(" vs. ");
  return matchObj;
}

function parseMatchData(matchArr) {
  if (!matchArr.length) {
    return [];
  }
  let matchesArr = [];
  const matchObj = {
    match_id: matchArr[0].match_id,
    event_id: matchArr[0].event_id,
    event_title: matchArr[0].event_title,
    promotion: matchArr[0].promotion_name,
    participants: [],
    championships: [],
    rating: matchArr[0].rating,
    rating_count: matchArr[0].rating_count,
    date: matchArr[0].date,
  };

  for (const [i, partObj] of matchArr.entries()) {
    if (partObj.match_id !== matchObj.match_id) {
      matchesArr.push({ ...matchObj });
      matchObj.match_id = partObj.match_id;
      matchObj.event_id = partObj.event_id;
      matchObj.event_title = partObj.event_title;
      matchObj.participants = [];
      matchObj.championships = [];
      matchObj.rating = partObj.rating;
      matchObj.rating_count = partObj.rating_count;
      matchObj.date = partObj.date;
      matchObj.promotion = partObj.promotion_name;
    }
    if (!matchObj.participants[partObj.participants]) {
      matchObj.participants[partObj.participants] = [];
    }
    if (
      !matchObj.participants[partObj.participants].includes(
        partObj.wrestler_name
      )
    ) {
      matchObj.participants[partObj.participants].push(partObj.wrestler_name);
    }

    if (!matchObj.championships.flat().includes(partObj.championship_name)) {
      matchObj.championships.push(partObj.championship_name);
    }

    if (i === matchArr.length - 1) {
      matchesArr.push({ ...matchObj });
    }
  }

  return matchesArr.map((match) => formatData(match));
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
        matches.event_id AS event_id,
        events.title AS event_title,
        participants.team AS participants,
        wrestlers.name AS wrestler_name,
        ROUND(AVG(ratings.rating)::numeric, 2) AS rating,
        (SELECT COUNT(*) FROM ratings WHERE ratings.match_id = matches.id) AS rating_count,
        championships.name AS championship_name
      FROM matches
      JOIN participants ON matches.id = participants.match_id
      JOIN wrestlers ON participants.wrestler_id = wrestlers.id
      JOIN events ON matches.event_id = events.id
      LEFT OUTER JOIN ratings ON matches.id = ratings.match_id
      LEFT OUTER JOIN matches_championships ON matches_championships.match_id = matches.id
      LEFT OUTER JOIN championships ON matches_championships.championship_id = championships.id
        WHERE matches.event_id = $1
      GROUP BY matches.id, participants.team, wrestlers.name, matches_championships.id, championships.name, events.title
      ORDER BY matches.match_number, participants.team ASC`,
      [eventId]
    );
    eventInfo[0].matches = parseMatchData(matches);
    return eventInfo;
  },
  getRecentEvents: async (numOfResults) => {
    const { rows: results } = await pool.query(
      `SELECT
        events.id AS id,
        events.title,
        TO_CHAR(events.date, 'YYYY-MM-DD') AS date,
        events.venue_id,
        promotions.name AS promotion_name
      FROM events
      JOIN promotions ON promotions.id = events.promotion_id
      ORDER BY date DESC, id ASC
      LIMIT $1;`,
      [numOfResults]
    );
    return results;
  },
  getTopRatedMatches: async (numOfMatches) => {
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth();
    if (month === 0) {
      month = 12; // December of the previous year
      year--; // Adjust the year accordingly
    }
    let year = date.getFullYear();
    let lastMonth = `${year}-${month}-${day}`;
    try {
      const { rows: results } = await pool.query(
        `
        SELECT
          matches.id AS match_id,
          matches.event_id AS event_id,
          TO_CHAR(events.date, 'YYYY-MM-DD') AS date,
          participants.team AS participants,
          wrestlers.name AS wrestler_name,
          CONCAT(promotions.name, ' ', events.title) AS event_title,
          ROUND(AVG(ratings.rating)::numeric, 2) AS rating,
          (SELECT COUNT(*) FROM ratings WHERE ratings.match_id = matches.id) AS rating_count,
          championships.name AS championship_name
        FROM matches
        JOIN participants ON matches.id = participants.match_id
        JOIN wrestlers ON participants.wrestler_id = wrestlers.id
        LEFT OUTER JOIN ratings ON matches.id = ratings.match_id
        LEFT OUTER JOIN matches_championships ON matches_championships.match_id = matches.id
        LEFT OUTER JOIN events ON events.id = matches.event_id
        LEFT OUTER JOIN promotions ON events.promotion_id = promotions.id
        LEFT OUTER JOIN championships ON matches_championships.championship_id = championships.id
          WHERE matches.id IN (
            SELECT matches.id FROM matches
            JOIN events ON matches.event_id = events.id
            JOIN ratings ON ratings.match_id = matches.id
            WHERE events.date > $1::DATE
              AND rating IS NOT NULL
              AND (SELECT COUNT(*) FROM ratings WHERE ratings.match_id = matches.id) >= 10
            GROUP BY matches.id, events.date
            ORDER BY (AVG(ratings.rating)) DESC, events.date DESC
            LIMIT $2
          )
        GROUP BY matches.id, participants.team, wrestlers.name, championship_name, participants.match_id, events.title, events.date, promotions.name
        ORDER BY rating DESC, participants.match_id, team;
        `,
        [lastMonth, numOfMatches]
      );
      return parseMatchData(results);
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  getMatchInfo: async (match_id) => {
    const { rows: result } = await pool.query(
      `
      SELECT
        matches.id AS match_id,
        matches.event_id AS event_id,
        participants.team AS participants,
        wrestlers.name AS wrestler_name,
        ROUND(AVG(ratings.rating)::numeric, 2) AS rating,
        (SELECT COUNT(*) FROM ratings WHERE match_id = $1) AS rating_count,
        championships.name AS championship_name
      FROM matches
      JOIN participants ON matches.id = participants.match_id
      JOIN wrestlers ON participants.wrestler_id = wrestlers.id
      LEFT OUTER JOIN ratings ON matches.id = ratings.match_id
      LEFT OUTER JOIN matches_championships ON matches_championships.match_id = matches.id
      LEFT OUTER JOIN championships ON matches_championships.championship_id = championships.id
        WHERE matches.id = $1
      GROUP BY matches.id, participants.team, wrestlers.name, championships.name
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
  getUserRating: async (user_id, match_id) => {
    const { rows: results } = await pool.query(
      "SELECT rating FROM ratings WHERE user_id = $1 AND match_id = $2",
      [user_id, match_id]
    );
    return results;
  },
  deleteUserRating: async (user_id, match_id) => {
    const { rows: results } = await pool.query(
      "DELETE FROM ratings WHERE user_id = $1 AND match_id = $2",
      [user_id, match_id]
    );
    return results;
  },
  getSearchResults: async (search_param, search_text) => {
    try {
      if (search_param === "events") {
        const { rows: results } = await pool.query(
          `SELECT events.id AS id, events.title AS title, TO_CHAR(events.date, 'YYYY-MM-DD') AS date, venues.name AS venue_name, promotions.name AS promotion_name
              FROM events
              JOIN venues ON events.venue_id = venues.id
              JOIN promotions ON events.promotion_id = promotions.id
              WHERE (promotions.name || ' ' || events.title) ILIKE '%' || $1 || '%'
              ORDER BY events.date DESC`,
          [search_text]
        );
        const data = { search_param: search_param, results: results };
        return data;
      }
      if (search_param === "promotions") {
        const { rows: events } = await pool.query(
          `SELECT events.id AS id, events.title AS title, TO_CHAR(events.date, 'YYYY-MM-DD') AS date, venues.name AS venue_name, promotions.name AS promotion_name
            FROM events
            JOIN venues ON events.venue_id = venues.id
            JOIN promotions ON events.promotion_id = promotions.id
          WHERE promotions.name ILIKE $1
          ORDER BY date DESC`,
          [search_text]
        );
        const data = { search_param: search_param, results: events };
        return data;
      }
      if (search_param === "championships") {
        if (search_text.indexOf("’") > -1) {
          search_text = search_text.split("’").join("'");
        }
        const { rows: results } = await pool.query(
          `SELECT
          participants.match_id AS match_id,
          matches.event_id AS event_id,
          CONCAT(promotions.name, ' ', events.title) AS event_title,
          TO_CHAR(events.date, 'YYYY-MM-DD') AS date,
          wrestlers.name AS wrestler_name,
          participants.team AS participants,
          championships.name AS championship_name,
          ROUND(AVG(ratings.rating)::numeric, 2) as rating,
          (SELECT COUNT(*) FROM ratings WHERE ratings.match_id = participants.match_id) AS rating_count
          FROM participants
          JOIN wrestlers ON participants.wrestler_id = wrestlers.id
          JOIN matches ON matches.id = participants.match_id
          LEFT OUTER JOIN matches_championships ON matches_championships.match_id = participants.match_id
          LEFT OUTER JOIN championships ON championships.id = matches_championships.championship_id
          LEFT OUTER JOIN ratings ON ratings.match_id = participants.match_id
          LEFT OUTER JOIN events ON matches.event_id = events.id
          LEFT OUTER JOIN promotions ON promotions.id = events.promotion_id
          WHERE matches.id = ANY(
            SELECT match_id FROM matches_championships WHERE championship_id = ANY(
              SELECT id FROM championships WHERE name ILIKE '%' || $1 || '%'
              )
            )
          GROUP BY participants.match_id, matches.event_id, wrestlers.name, participants.team, championships.name, rating_count, events.title, events.date, promotions.name
          ORDER BY date DESC, match_id, team;`,
          [search_text]
        );
        const data = {
          search_param: search_param,
          results: parseMatchData(results),
        };
        return data;
      }
      if (search_param === "matches") {
        const wrestlersArr = search_text
          .split(",")
          .map((wrestler) => wrestler.trim())
          .map((wrestler) => `%${wrestler}%`);
        const { rows: matches } = await pool.query(
          `SELECT
          participants.match_id AS match_id,
          matches.event_id AS event_id,
          CONCAT(promotions.name, ' ', events.title) AS event_title,
          TO_CHAR(events.date, 'YYYY-MM-DD') AS date,
          wrestlers.name AS wrestler_name,
          participants.team AS participants,
          championships.name AS championship_name,
          ROUND(AVG(ratings.rating)::numeric, 2) as rating,
          (SELECT COUNT(*) FROM ratings WHERE ratings.match_id = participants.match_id) AS rating_count
          FROM participants
          JOIN wrestlers ON participants.wrestler_id = wrestlers.id
          JOIN matches ON matches.id = participants.match_id
          LEFT OUTER JOIN matches_championships ON matches_championships.match_id = participants.match_id
          LEFT OUTER JOIN championships ON championships.id = matches_championships.championship_id
          LEFT OUTER JOIN ratings ON ratings.match_id = participants.match_id
          LEFT OUTER JOIN events ON matches.event_id = events.id
          LEFT OUTER JOIN promotions ON promotions.id = events.promotion_id
          WHERE matches.id = ANY(
            SELECT match_id FROM (
              SELECT matches.id AS match_id
              FROM matches
              JOIN participants ON matches.id = participants.match_id
              JOIN wrestlers ON participants.wrestler_id = wrestlers.id
              WHERE wrestlers.name ILIKE ANY($1)
            )
            GROUP BY match_id
            HAVING COUNT(match_id) >= $2
          )
          GROUP BY participants.match_id, matches.event_id, wrestlers.name, participants.team, championships.name, rating_count, events.title, events.date, promotions.name
          ORDER BY date DESC, match_id, team;`,
          [wrestlersArr, wrestlersArr.length]
        );
        const data = {
          search_param: search_param,
          results: parseMatchData(matches),
        };
        return data;
      }
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  },
  getUserRatings: async (user_id) => {
    const { rows: userRatings } = await pool.query(
      `SELECT
        matches.id AS match_id,
        matches.event_id AS event_id,
        events.title AS event_title,
        TO_CHAR(events.date, 'YYYY-MM-DD') AS date,
        participants.team AS participants,
        wrestlers.name AS wrestler_name,
        AVG(ratings.rating) AS rating,
        (SELECT COUNT(*) FROM ratings WHERE ratings.match_id = matches.id) AS rating_count,
        championships.name AS championship_name,
        promotions.name AS promotion_name
      FROM matches
      JOIN participants ON matches.id = participants.match_id
      JOIN wrestlers ON participants.wrestler_id = wrestlers.id
      LEFT OUTER JOIN ratings ON matches.id = ratings.match_id
      LEFT OUTER JOIN matches_championships ON matches_championships.match_id = matches.id
      LEFT OUTER JOIN events ON events.id = matches.event_id
      LEFT OUTER JOIN championships ON matches_championships.championship_id = championships.id
      LEFT OUTER JOIN promotions ON events.promotion_id = promotions.id
        WHERE matches.id IN (
        SELECT ratings.match_id FROM ratings WHERE ratings.user_id = $1
      )
      GROUP BY matches.id, participants.team, wrestlers.name, championship_name, participants.match_id, events.title, promotions.name, events.date
      ORDER BY events.date DESC, participants.match_id, team;`,
      [user_id]
    );
    const results = parseMatchData(userRatings);
    return results;
  },
  getPromotions: async () => {
    const { rows: promotions } = await pool.query(
      `SELECT id, name FROM promotions`
    );
    return promotions;
  },
};
