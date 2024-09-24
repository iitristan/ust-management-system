const { executeTransaction } = require('../utils/queryExecutor');

const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      picture VARCHAR(255),
      hd VARCHAR(255)
    )
  `;
  return executeTransaction([{ query, params: [] }]);
};

const insertUser = async (name, email, role, picture, hd) => {
  const query = `
    INSERT INTO Users (name, email, role, picture, hd)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const params = [name, email, role, picture, hd];
  return executeTransaction([{ query, params }]);
};

const getUserById = async (id) => {
  const query = "SELECT * FROM Users WHERE id = $1";
  const params = [id];
  return executeTransaction([{ query, params }]);
};

const getAllUsers = async () => {
  const query = "SELECT * FROM Users";
  return executeTransaction([{ query, params: [] }]);
};

const updateUser = async (id, name, email, role, picture, hd) => {
  const query = `
    UPDATE Users
    SET name = $1, email = $2, role = $3, picture = $4, hd = $5
    WHERE id = $6
    RETURNING *
  `;
  const params = [name, email, role, picture, hd, id];
  return executeTransaction([{ query, params }]);
};

const deleteUser = async (id) => {
  const query = `
    DELETE FROM Users
    WHERE id = $1
  `;
  const params = [id];
  return executeTransaction([{ query, params }]);
};

module.exports = {
  createUserTable,
  insertUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};