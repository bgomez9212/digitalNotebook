const { Pool } = require("pg");

const pool = new Pool({
  user: "brandongomez",
  host: "localhost",
  database: "matchguide",
  password: "",
  port: 5432,
});

pool.on("error", function (err, client) {
  console.error("idle client error", err.message, err.stack);
});

module.exports = pool;
