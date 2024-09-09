const { executeTransaction } = require('../utils/queryExecutor');

const createEventsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Events (
      id SERIAL PRIMARY KEY,
      event_name VARCHAR(100) NOT NULL,
      description TEXT,
      event_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  return executeTransaction([{ query, params: [] }]);
};

const createEvent = async (data) => {
  const columns = Object.keys(data).join(", ");
  const placeholders = Object.keys(data).map((_, i) => `$${i + 1}`).join(", ");
  const query = `INSERT INTO Events (${columns}) VALUES (${placeholders}) RETURNING *`;
  const params = Object.values(data);
  return executeTransaction([{ query, params }]);
};

const readEvents = async () => {
  const query = "SELECT * FROM Events";
  return executeTransaction([{ query, params: [] }]);
};

const updateEvent = async (id, data) => {
  const setString = Object.keys(data)
    .map((key, i) => `${key} = $${i + 1}`)
    .join(", ");
  const query = `UPDATE Events SET ${setString} WHERE id = $${Object.keys(data).length + 1} RETURNING *`;
  const params = [...Object.values(data), id];
  return executeTransaction([{ query, params }]);
};

const deleteEvent = async (id) => {
  const query = "DELETE FROM Events WHERE id = $1 RETURNING *";
  return executeTransaction([{ query, params: [id] }]);
};

module.exports = {
  createEventsTable,
  createEvent,
  readEvents,
  updateEvent,
  deleteEvent
};
