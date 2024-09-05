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
      "assetName" VARCHAR(255) NOT NULL,
      "assetDetails" TEXT,
      category VARCHAR(255),
      location VARCHAR(255),
      quantity BIGINT NOT NULL,
      cost DECIMAL(20, 2),
      image TEXT,
      type VARCHAR(50),
      "createdDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
			console.log("Executing query:", query);
			console.log("With params:", params);
			const result = await client.query(query, params);
			console.log("Query result:", result.rows);
			results.push(result.rows);
		}

		await client.query("COMMIT");
		return results.flat();
	} catch (err) {
		await client.query("ROLLBACK");
		console.error("Transaction error", err);
		throw err;
	} finally {
		client.release();
	}
};

// Add these new functions:

// Function to get all categories
const getCategories = async () => {
	const query = "SELECT category_name FROM Categories";
	return executeTransaction([{ query, params: [] }]);
};

// Function to get all locations
const getLocations = async () => {
	const query = "SELECT location_name FROM Locations";
	return executeTransaction([{ query, params: [] }]);
};

// Function to add a new category
const addCategory = async (categoryName) => {
	const query =
		"INSERT INTO Categories (category_name) VALUES ($1) RETURNING *";
	return executeTransaction([{ query, params: [categoryName] }]);
};

// Function to add a new location
const addLocation = async (locationName) => {
	const query = "INSERT INTO Locations (location_name) VALUES ($1) RETURNING *";
	return executeTransaction([{ query, params: [locationName] }]);
};

// Function to delete a category
const deleteCategory = async (categoryName) => {
	const query = "DELETE FROM Categories WHERE category_name = $1 RETURNING *";
	return executeTransaction([{ query, params: [categoryName] }]);
};

// Function to delete a location
const deleteLocation = async (locationName) => {
	const query = "DELETE FROM Locations WHERE location_name = $1 RETURNING *";
	return executeTransaction([{ query, params: [locationName] }]);
};



// Function to create a new record
const createRecord = async (tableName, data) => {
	const columns = Object.keys(data)
		.map((key) => `"${key}"`)
		.join(", ");
	const values = Object.values(data);
	const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

	const query = `INSERT INTO "${tableName}" (${columns}) VALUES (${placeholders}) RETURNING *`;
	console.log("Executing query:", query, tableName);
	console.log("With values:", values);



	try {
		const client = await con.connect();
		try {
			const result = await client.query(query, values);
			console.log("Database result:", result.rows);
			return result.rows;
		} catch (err) {
			console.error("Error executing query:", err);
			throw err;
		} finally {
			client.release();
		}
	} catch (err) {
		console.error("Error in createRecord:", err);
		throw err;
	}
};

module.exports = {
	// Create
	createRecord,

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

	getCategories,
	getLocations,
	addCategory,
	addLocation,
	deleteCategory,
	deleteLocation,
};
