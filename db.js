const { Pool } = require("pg");

const con = new Pool({
	host: "localhost",
	user: "postgres",
	port: 5432,
	password: "123",
	database: "OSAMS_UST",
});

// Function to create necessary tables
const createTables = async () => {
	const client = await con.connect();
	try {
		await client.query("BEGIN");

		// Create Users table
		await client.query(`
      CREATE TABLE IF NOT EXISTS Users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        role VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

		// Create Assets table
await client.query(`
  CREATE TABLE IF NOT EXISTS Assets (
      asset_id SERIAL PRIMARY KEY,
      asset_name VARCHAR(255) NOT NULL,
      asset_details TEXT,
      selected_category VARCHAR(255),
      selected_location VARCHAR(255),
      quantity INTEGER NOT NULL,
      cost DECIMAL(10, 2),
      image TEXT,
      created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create Categories table
await client.query(`
  CREATE TABLE IF NOT EXISTS Categories (
      category_id SERIAL PRIMARY KEY,
      category_name VARCHAR(255) NOT NULL
  )
`);

// Create Locations table
await client.query(`
  CREATE TABLE IF NOT EXISTS Locations (
      location_id SERIAL PRIMARY KEY,
      location_name VARCHAR(255) NOT NULL
  )
`);


		// Create Events table
		await client.query(`
      CREATE TABLE IF NOT EXISTS Events (
        id SERIAL PRIMARY KEY,
        event_name VARCHAR(100) NOT NULL,
        description TEXT,
        event_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

		await client.query("COMMIT");
		console.log("Tables created successfully");
	} catch (err) {
		await client.query("ROLLBACK");
		console.error("Error creating tables", err);
		throw err;
	} finally {
		client.release();
	}
};

// Run the table creation
createTables().catch((err) => console.error("Error in table creation:", err));

// Centralized function for transactional queries
const executeTransaction = async (queries) => {
	const client = await con.connect();
	try {
		await client.query("BEGIN");

		const results = [];
		for (const { query, params } of queries) {
			const result = await client.query(query, params);
			results.push(result.rows); // Store the result
		}

		await client.query("COMMIT");
		return results.flat(); // Flatten the results array
	} catch (err) {
		await client.query("ROLLBACK");
		console.error("Transaction error", err);
		throw err;
	} finally {
		client.release();
	}
};

module.exports = {
	// Create
	createRecord: async (tableName, values) => {
		const columns = Object.keys(values).join(", ");
		const placeholders = Object.keys(values)
			.map((_, i) => `$${i + 1}`)
			.join(", ");
		const query = `INSERT INTO ${tableName}(${columns}) VALUES (${placeholders}) RETURNING *`;
		const params = Object.values(values);
		return executeTransaction([{ query, params }]);
	},

	// Read
	readRecords: async (tableName) => {
		const query = `SELECT * FROM ${tableName}`;
		const params = [];
		return executeTransaction([{ query, params }]);
	},

	// Update
	updateRecord: async (tableName, values, id) => {
		const setString = Object.keys(values)
			.map((key, i) => `${key} = $${i + 1}`)
			.join(", ");
		const query = `UPDATE ${tableName} SET ${setString} WHERE id = $${
			Object.keys(values).length + 1
		} RETURNING *`;
		const params = [...Object.values(values), id];
		return executeTransaction([{ query, params }]);
	},

	// Delete
	deleteRecord: async (tableName, id) => {
		const query = `DELETE FROM ${tableName} WHERE id = $1 RETURNING *`;
		const params = [id];
		return executeTransaction([{ query, params }]);
	},
};


