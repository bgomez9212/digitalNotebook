const { Pool } = require("pg");
const dotenv = require("dotenv").config();
const config =
  process.env.NODE_ENV === "test"
    ? {
        user: process.env.USERNAME_TEST,
        host: process.env.HOST_TEST,
        database: process.env.DATABASE_TEST,
        password: process.env.PASSWORD_TEST,
        port: process.env.DB_PORT_TEST,
      }
    : {
        user: process.env.USERNAME,
        host: process.env.HOST,
        database: process.env.DATABASE,
        password: process.env.PASSWORD,
        port: process.env.DB_PORT,
      };

const pool = new Pool(config);

pool.on("error", function (err, client) {
  console.error("idle client error", err.message, err.stack);
});

module.exports = pool;
