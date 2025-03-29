const pool = require("./db.js");

const apiKeyMiddleware = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"] || req.query.apiKey;

  if (!apiKey) {
    return res.status(401).json({ error: "API key is required" });
  }

  try {
    const { rows: keyExists } = await pool.query(
      `SELECT id FROM api_keys WHERE uuid = $1`,
      [apiKey]
    );

    if (!keyExists.length) {
      return res.status(403).json({ error: "Invalid API key" });
    }

    next();
  } catch (err) {
    console.error("API key validation error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = apiKeyMiddleware;
