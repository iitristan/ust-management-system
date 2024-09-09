const pool = require('../config/database');

const executeTransaction = async (queries) => {
  const client = await pool.connect();
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

module.exports = { executeTransaction };
