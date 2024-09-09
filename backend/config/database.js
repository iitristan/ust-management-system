const { Pool } = require('pg');

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "123",
  database: "OSAMS_UST",
});

module.exports = pool;


