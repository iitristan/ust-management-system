const { executeTransaction } = require('../utils/queryExecutor');
const pool = require('../config/database');

const createEventsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Events (
      unique_id VARCHAR(20) PRIMARY KEY,
      event_name VARCHAR(100) NOT NULL,
      description TEXT,
      event_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  return executeTransaction([{ query, params: [] }]);
};

const getLastUniqueId = async () => {
  const query = "SELECT unique_id FROM Events ORDER BY unique_id DESC LIMIT 1";
  const result = await executeTransaction([{ query, params: [] }]);
  return result[0]?.unique_id || 'OSA-EVENT-0000';
};

const generateNextUniqueId = async () => {
  const lastId = await getLastUniqueId();
  const numPart = parseInt(lastId.split('-')[2]);
  const nextNum = numPart + 1;
  return `OSA-EVENT-${nextNum.toString().padStart(4, '0')}`;
};

const createEvent = async (data) => {
  const uniqueId = await generateNextUniqueId();
  const columns = Object.keys(data).join(", ") + ", unique_id";
  const placeholders = Object.keys(data).map((_, i) => `$${i + 1}`).join(", ") + `, $${Object.keys(data).length + 1}`;
  const query = `INSERT INTO Events (${columns}) VALUES (${placeholders}) RETURNING *`;
  const params = [...Object.values(data), uniqueId];
  return executeTransaction([{ query, params }]);
};

const readEvents = async () => {
  const query = "SELECT * FROM Events ORDER BY unique_id";
  return executeTransaction([{ query, params: [] }]);
};

const updateEvent = async (uniqueId, data) => {
  const setString = Object.keys(data)
    .map((key, i) => `${key} = $${i + 1}`)
    .join(", ");
  const query = `UPDATE Events SET ${setString} WHERE unique_id = $${Object.keys(data).length + 1} RETURNING *`;
  const params = [...Object.values(data), uniqueId];
  return executeTransaction([{ query, params }]);
};

const deleteEvent = async (uniqueId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Delete the event
    const deleteQuery = "DELETE FROM Events WHERE unique_id = $1 RETURNING *";
    const deleteResult = await client.query(deleteQuery, [uniqueId]);

    if (deleteResult.rows.length > 0) {
      // Get all events with unique_id greater than the deleted event
      const selectQuery = "SELECT unique_id FROM Events WHERE unique_id > $1 ORDER BY unique_id";
      const selectResult = await client.query(selectQuery, [uniqueId]);

      // Update unique_ids of remaining events
      for (let i = 0; i < selectResult.rows.length; i++) {
        const updateUniqueId = selectResult.rows[i].unique_id;
        const newUniqueId = `OSA-EVENT-${(parseInt(updateUniqueId.split('-')[2]) - 1).toString().padStart(4, '0')}`;
        const updateQuery = "UPDATE Events SET unique_id = $1 WHERE unique_id = $2 RETURNING *";
        await client.query(updateQuery, [newUniqueId, updateUniqueId]);
      }

      // Get the updated events
      const updatedEventsQuery = "SELECT * FROM Events ORDER BY unique_id";
      const updatedEventsResult = await client.query(updatedEventsQuery);

      await client.query('COMMIT');
      return updatedEventsResult.rows;
    } else {
      await client.query('ROLLBACK');
      return [];
    }
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  createEventsTable,
  createEvent,
  readEvents,
  updateEvent,
  deleteEvent
};