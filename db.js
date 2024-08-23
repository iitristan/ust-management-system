const { Pool } = require("pg");

const con = new Pool({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "admin",
  database: "OSAMS_UST",
});

// Connect to the database and check for the Users table
con.connect()
  .then(async () => {
    console.log("Connected to the database");

    // Create the Users table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        role VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      await con.query(createTableQuery);
      console.log("Users table created or already exists");
    } catch (err) {
      console.error("Error creating Users table", err);
    }
  })
  .catch((err) => console.error("Database connection error", err));

module.exports = {
  // Create
  createRecord: async (tableName, values) => {
    const query = `INSERT INTO ${tableName}(${Object.keys(values).join(", ")}) VALUES (${Object.keys(values).map((_, i) => `$${i + 1}`).join(", ")}) RETURNING *`;
    const params = Object.values(values);

    try {
      const result = await con.query(query, params);
      return result.rows[0];
    } catch (err) {
      console.error("Error creating record", err);
    }
  },

  // Read
  readRecords: async (tableName) => {
    try {
      const result = await con.query(`SELECT * FROM ${tableName}`);
      return result.rows;
    } catch (err) {
      console.error("Error reading records", err);
    }
  },

  // Update
  updateRecord: async (tableName, values, id) => {
    const setString = Object.keys(values).map((key, i) => `${key} = $${i + 1}`).join(", ");
    const query = `UPDATE ${tableName} SET ${setString} WHERE id = $${Object.keys(values).length + 1} RETURNING *`;
    const params = [...Object.values(values), id];

    try {
      const result = await con.query(query, params);
      return result.rows[0];
    } catch (err) {
      console.error("Error updating record", err);
    }
  },

  // Delete
  deleteRecord: async (tableName, id) => {
    const query = `DELETE FROM ${tableName} WHERE id = $1 RETURNING *`;
    try {
      const result = await con.query(query, [id]);
      return result.rows[0];
    } catch (err) {
      console.error("Error deleting record", err);
    }
  },
};
