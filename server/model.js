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
    date: matchArr[0].date,
    user_rating: matchArr[0].user_rating,
    community_rating: matchArr[0].community_rating,
    rating_count: matchArr[0].rating_count,
    rating_date: matchArr[0].rating_date,
  };

  for (const [i, partObj] of matchArr.entries()) {
    if (partObj.match_id !== matchObj.match_id) {
      matchesArr.push({ ...matchObj });
      matchObj.match_id = partObj.match_id;
      matchObj.event_id = partObj.event_id;
      matchObj.event_title = partObj.event_title;
      matchObj.participants = [];
      matchObj.championships = [];
      matchObj.date = partObj.date;
      matchObj.promotion = partObj.promotion_name;
      matchObj.user_rating = partObj.user_rating;
      matchObj.community_rating = partObj.community_rating;
      matchObj.rating_count = partObj.rating_count;
      matchObj.rating_date = partObj.rating_date;
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
  getEvent: async (eventId, user_id) => {
    const { rows: eventInfo } = await pool.query(
      `SELECT
        events.title AS title,
        TO_CHAR(events.date, 'YYYY-MM-DD') AS date,
        promotions.name AS promotion_name,
        venues.name AS venue_name,
        venues.city,
        venues.state,
        venues.country,
        ROUND(AVG(ratings.rating) :: numeric, 2) AS avg_rating
      FROM events
      JOIN promotions ON events.promotion_id = promotions.id
      JOIN venues ON events.venue_id = venues.id
      LEFT JOIN (
        SELECT event_id, AVG(rating) AS rating
        FROM matches
        JOIN ratings ON matches.id = ratings.match_id
        GROUP BY event_id
      ) AS ratings ON events.id = ratings.event_id
      WHERE events.id = $1
      GROUP BY events.title, events.date, promotions.name, venues.name, venues.city, venues,state, venues.country`,
      [eventId]
    );
    const { rows: matches } = await pool.query(
      `
      SELECT
        matches.id AS match_id,
        promotions.name AS promotion_name,
        matches.event_id AS event_id,
        events.title AS event_title,
        participants.team AS participants,
        wrestlers.name AS wrestler_name,
        (SELECT rating from ratings WHERE ratings.match_id = matches.id AND ratings.user_id = $2) AS user_rating,
        ROUND(AVG(ratings.rating)::numeric, 2) AS community_rating,
        CAST((SELECT COUNT(*) FROM ratings WHERE ratings.match_id = matches.id) AS INTEGER) AS rating_count,
        championships.name AS championship_name
      FROM matches
      JOIN participants ON matches.id = participants.match_id
      JOIN wrestlers ON participants.wrestler_id = wrestlers.id
      JOIN events ON matches.event_id = events.id
      JOIN promotions ON promotions.id = events.promotion_id
      LEFT OUTER JOIN ratings ON matches.id = ratings.match_id
      LEFT OUTER JOIN matches_championships ON matches_championships.match_id = matches.id
      LEFT OUTER JOIN championships ON matches_championships.championship_id = championships.id
        WHERE matches.event_id = $1
      GROUP BY matches.id, participants.team, wrestlers.name, matches_championships.id, championships.name, events.title, promotions.name
      ORDER BY matches.match_number, participants.team ASC`,
      [eventId, user_id]
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
  getTopRatedMatches: async (numOfMatches, user_id) => {
    let today = new Date();
    let lastMonth = new Date(today.setDate(today.getDate() - 30));
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
          (SELECT ratings.rating FROM ratings WHERE ratings.match_id = matches.id AND ratings.user_id = $3) AS user_rating,
          ROUND((SELECT AVG(ratings.rating) FROM ratings WHERE ratings.match_id = matches.id)::numeric, 2) AS community_rating,
          CAST((SELECT COUNT(*) FROM ratings WHERE ratings.match_id = matches.id) AS INTEGER) AS rating_count,
          championships.name AS championship_name
        FROM matches
        JOIN participants ON matches.id = participants.match_id
        JOIN wrestlers ON participants.wrestler_id = wrestlers.id
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
        ORDER BY community_rating DESC, match_id, team;
        `,
        [lastMonth.toISOString().slice(0, 10), numOfMatches, user_id]
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
        championships.name AS championship_name
      FROM matches
      JOIN participants ON matches.id = participants.match_id
      JOIN wrestlers ON participants.wrestler_id = wrestlers.id
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
    let today = new Date();
    const { rows: results } = await pool.query(
      "INSERT INTO ratings (user_id, match_id, rating, date) VALUES ($1, $2, $3, $4) ON CONFLICT (match_id, user_id) DO UPDATE SET rating = $3",
      [user_id, match_id, rating, today]
    );
    return results;
  },
  getUserRating: async (user_id, match_id) => {
    const { rows: userRating } = await pool.query(
      "SELECT rating FROM ratings WHERE user_id = $1 AND match_id = $2",
      [user_id, match_id]
    );
    const { rows: communityRating } = await pool.query(
      `SELECT
        ROUND(AVG(ratings.rating)::numeric, 2) AS rating,
        (SELECT COUNT(*) FROM ratings WHERE match_id = $1) AS rating_count
      FROM matches
      LEFT OUTER JOIN ratings ON matches.id = ratings.match_id
      WHERE matches.id = $1`,
      [match_id]
    );
    return { userRating: userRating[0], communityRating: communityRating[0] };
  },
  deleteUserRating: async (user_id, match_id) => {
    const { rows: results } = await pool.query(
      "DELETE FROM ratings WHERE user_id = $1 AND match_id = $2",
      [user_id, match_id]
    );
    return results;
  },
  getSearchResults: async (search_param, search_text, user_id) => {
    try {
      if (search_param === "events") {
        const { rows: results } = await pool.query(
          `
          SELECT events.id AS id,
              events.title AS title,
              TO_CHAR(events.date, 'YYYY-MM-DD') AS date,
              venues.name AS venue_name,
              promotions.name AS promotion_name,
              ROUND(AVG(ratings.rating) :: numeric, 2) AS avg_rating
          FROM events
          JOIN venues ON events.venue_id = venues.id
          JOIN promotions ON events.promotion_id = promotions.id
          LEFT JOIN (
              SELECT event_id, AVG(rating) AS rating
              FROM matches
              JOIN ratings ON matches.id = ratings.match_id
              GROUP BY event_id
          ) AS ratings ON events.id = ratings.event_id
          WHERE (promotions.name || ' ' || unaccent(events.title)) ILIKE '%' || $1 || '%'
          GROUP BY events.id, events.title, events.date, venues.name, promotions.name
          ORDER BY events.date DESC;
          `,
          [search_text]
        );
        const data = { search_param: search_param, results: results };
        return data;
      }
      if (search_param === "promotions") {
        const { rows: events } = await pool.query(
          `
          SELECT events.id AS id,
          events.title AS title,
          TO_CHAR(events.date, 'YYYY-MM-DD') AS date,
          venues.name AS venue_name,
          promotions.name AS promotion_name,
          ROUND(AVG(ratings.rating) :: numeric, 2) AS avg_rating
            FROM events
            JOIN venues ON events.venue_id = venues.id
            JOIN promotions ON events.promotion_id = promotions.id
            LEFT JOIN (
              SELECT event_id, AVG(rating) AS rating
              FROM matches
              JOIN ratings ON matches.id = ratings.match_id
              GROUP BY event_id
          ) AS ratings ON events.id = ratings.event_id
          WHERE promotions.name ILIKE $1
          GROUP BY events.id, venues.name, promotions.name
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
          ROUND(AVG(ratings.rating)::numeric, 2) as community_rating,
          (SELECT rating from ratings WHERE ratings.match_id = participants.match_id AND ratings.user_id = $3) AS user_rating,
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
              WHERE unaccent(wrestlers.name) ILIKE ANY($1)
            )
            GROUP BY match_id
            HAVING COUNT(match_id) >= $2
          )
          GROUP BY participants.match_id, matches.event_id, wrestlers.name, participants.team, championships.name, rating_count, events.title, events.date, promotions.name
          ORDER BY date DESC, match_id, team;`,
          [wrestlersArr, wrestlersArr.length, user_id]
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
  getUsersRatedMatches: async (user_id) => {
    const { rows: userRatings } = await pool.query(
      `SELECT
          matches.id AS match_id,
          matches.event_id AS event_id,
          events.title AS event_title,
          TO_CHAR(events.date, 'YYYY-MM-DD') AS date,
          participants.team AS participants,
          wrestlers.name AS wrestler_name,
          championships.name AS championship_name,
          promotions.name AS promotion_name,
          ratings.date AS rating_date,
          ratings.rating AS user_rating,
          CAST((SELECT COUNT(*) FROM ratings WHERE ratings.match_id = matches.id) AS INTEGER) AS rating_count,
          ROUND((SELECT AVG(ratings.rating) FROM ratings WHERE ratings.match_id = matches.id)::numeric, 2) AS community_rating
      FROM matches
      JOIN participants ON matches.id = participants.match_id
      JOIN wrestlers ON participants.wrestler_id = wrestlers.id
      LEFT OUTER JOIN ratings ON matches.id = ratings.match_id AND ratings.user_id = $1
      LEFT OUTER JOIN matches_championships ON matches_championships.match_id = matches.id
      LEFT OUTER JOIN events ON events.id = matches.event_id
      LEFT OUTER JOIN championships ON matches_championships.championship_id = championships.id
      LEFT OUTER JOIN promotions ON events.promotion_id = promotions.id
      WHERE ratings.user_id = $1
      GROUP BY matches.id, participants.team, wrestlers.name, championship_name, participants.match_id, events.title, promotions.name, events.date, ratings.date, ratings.rating
      ORDER BY ratings.date DESC, participants.match_id, team;`,
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
  checkUsernames: async (user_name) => {
    try {
      const { rows: usernames } = await pool.query(
        `SELECT id FROM users WHERE LOWER(username) = $1`,
        [user_name.toLowerCase()]
      );
      return usernames;
    } catch (err) {
      throw new Error(err);
    }
  },
  createUser: async (user_id, username) => {
    try {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      const yyyy = today.getFullYear();
      const date = mm + "/" + dd + "/" + yyyy;
      const { rows: result } = await pool.query(
        `INSERT INTO users(user_id, username, join_date) VALUES ($1, $2, $3)`,
        [user_id, username, date]
      );
      return result;
    } catch (err) {
      throw new Error(err);
    }
  },
  getUsername: async (user_id) => {
    try {
      const { rows: username } = await pool.query(
        `SELECT username FROM users WHERE user_id = $1`,
        [user_id]
      );
      return username;
    } catch (err) {
      throw new Error(err);
    }
  },
  editUsername: async (user_id, username) => {
    try {
      const { rows: results } = await pool.query(
        `UPDATE users SET username = $1 WHERE user_id = $2`,
        [username, user_id]
      );
      return results;
    } catch (err) {
      throw new Error(err);
    }
  },
  deleteUser: async (user_id) => {
    try {
      const deleteFromRatings = await pool.query(
        `DELETE FROM ratings WHERE user_id = $1`,
        [user_id]
      );

      const deleteFromUsernames = await pool.query(
        `DELETE FROM users WHERE user_id = $1`,
        [user_id]
      );
      return {
        success: true,
        message: "User and ratings deleted successfully",
        deletedRatingsCount: deleteRatingsResult.rowCount,
        deletedUserCount: deleteUserResult.rowCount,
      };
    } catch (err) {
      throw new Error(err);
    }
  },
  postEvent: async (event) => {
    try {
      // statement to prevent injection if event exists
      const { rows: preventInjection } = await pool.query(
        "SELECT id FROM events WHERE title = $1 AND date = $2",
        [event.eventTitle, event.date]
      );
      if (preventInjection.length) {
        throw new Error("event already exists");
      }
      // statement to prevent injection if apikey does not exist
      const { rows: apiKeyId } = await pool.query(
        "SELECT id FROM api_keys WHERE uuid = $1",
        [event.apiKey]
      );
      if (!apiKeyId.length) {
        throw new Error("invalid API key");
      }
      // insert/get venue id
      const { rows: venueId } = await pool.query(
        `
          WITH existing_id AS (
            SELECT id
            FROM venues
            WHERE name = $1
          ),
          ins AS (
            INSERT INTO venues(name, city, state, country)
            SELECT $1, $2, $3, $4
            WHERE NOT EXISTS (SELECT 1 FROM existing_id)
            RETURNING id
          )
            SELECT id FROM ins
            UNION ALL
            SELECT id FROM existing_id;
          `,
        [event.venueName, event.city, event.state, event.country]
      );
      // insert/get promotion id
      const { rows: promotionId } = await pool.query(
        `
            WITH existing_id AS (
              SELECT id
              FROM promotions
              WHERE name = $1
            ),
            ins AS (
              INSERT INTO promotions(name)
              SELECT $1
              WHERE NOT EXISTS (SELECT 1 FROM existing_id)
              RETURNING id
            )
            SELECT id FROM ins
            UNION ALL
            SELECT id FROM existing_id;
          `,
        [event.promotion]
      );
      // insert/get event id
      const { rows: eventId } = await pool.query(
        `
          WITH existing_id AS (
            SELECT id
            FROM events
            WHERE title = $1
          ),
          ins AS (
            INSERT INTO events(title, date, venue_id, promotion_id, api_key_id)
            SELECT $1, $2, $3, $4, $5
            WHERE NOT EXISTS (SELECT 1 FROM existing_id)
            RETURNING id
          )
          SELECT id FROM ins
          UNION ALL
          SELECT id FROM existing_id
          `,
        [
          event.eventTitle,
          event.date,
          venueId[0].id,
          promotionId[0].id,
          apiKeyId[0].id,
        ]
      );
      for (const match of event.matches) {
        // create matches based off of match num and event id, returning match id
        const { rows: matchId } = await pool.query(
          "INSERT INTO matches(match_number, event_id) VALUES ($1, $2) returning id",
          [match.match_num, eventId[0].id]
        );
        // create or get championship id
        if (match.championship) {
          let championships = match.championship.split(", ");
          for (let championship of championships) {
            const { rows: championshipId } = await pool.query(
              `
                    WITH existing_id AS (
                      SELECT id
                      FROM championships
                      WHERE name = $1
                    ),
                    ins AS (
                    INSERT INTO championships(name)
                    SELECT $1
                    WHERE NOT EXISTS (SELECT 1 FROM existing_id)
                    RETURNING id
                    )
                    SELECT id FROM ins
                    UNION ALL
                    SELECT id FROM existing_id
                    `,
              [championship]
            );
            // fill matches_championships based off match id and championship id
            await pool.query(
              `INSERT INTO matches_championships(championship_id, match_id) VALUES($1, $2)`,
              [championshipId[0].id, matchId[0].id]
            );
          }
        }
        let index = 0;
        let participants = match.participants
          .split(" vs. ")
          .map((participant) => participant.split(", "));
        for (const team of participants) {
          // another loop to get each wrestler
          for (participant of team) {
            // insert into wrestlers / get wrestler id
            const { rows: wrestlerId } = await pool.query(
              `
                        WITH existing_id AS (
                          SELECT id
                          FROM wrestlers
                          WHERE name = $1
                        ),
                        ins AS (
                          INSERT INTO wrestlers(name)
                          SELECT $1
                          WHERE NOT EXISTS (SELECT 1 FROM existing_id)
                          RETURNING id
                        )
                        SELECT id FROM ins
                        UNION ALL
                        SELECT id FROM existing_id
                        `,
              [participant]
            );
            // insert into participants
            await pool.query(
              `INSERT INTO participants(match_id, wrestler_id, team) VALUES ($1, $2, $3)`,
              [matchId[0].id, wrestlerId[0].id, index]
            );
          }
          index += 1;
        }
      }
    } catch (err) {
      throw err;
    }
  },
};
