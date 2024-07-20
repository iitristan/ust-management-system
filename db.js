const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "tristan",
  database: "mydatabase",
});

pool.connect((err) => {
  if (err) {
    console.error("Connection error", err.stack);
  } else {
    console.log("Connected to PostgreSQL Database!");
  }
});

module.exports = pool;
