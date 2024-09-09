const { executeTransaction } = require('../utils/queryExecutor');

const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      role VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  return executeTransaction([{ query, params: [] }]);
};

const createUser = async (data) => {
  const columns = Object.keys(data).join(", ");
  const placeholders = Object.keys(data).map((_, i) => `$${i + 1}`).join(", ");
  const query = `INSERT INTO Users (${columns}) VALUES (${placeholders}) RETURNING *`;
  const params = Object.values(data);
  return executeTransaction([{ query, params }]);
};

const readUsers = async () => {
  const query = "SELECT * FROM Users";
  return executeTransaction([{ query, params: [] }]);
};

const updateUser = async (id, data) => {
  const setString = Object.keys(data)
    .map((key, i) => `${key} = $${i + 1}`)
    .join(", ");
  const query = `UPDATE Users SET ${setString} WHERE id = $${Object.keys(data).length + 1} RETURNING *`;
  const params = [...Object.values(data), id];
  return executeTransaction([{ query, params }]);
};

const deleteUser = async (id) => {
  const query = "DELETE FROM Users WHERE id = $1 RETURNING *";
  return executeTransaction([{ query, params: [id] }]);
};

module.exports = {
  createUsersTable,
  createUser,
  readUsers,
  updateUser,
  deleteUser
};
