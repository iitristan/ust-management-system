const { Pool } = require('pg');

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "admin",
  database: "OSAMS_UST",
});

module.exports = pool;


