const { executeTransaction } = require('../utils/queryExecutor');
const pool = require('../config/database');

const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      role VARCHAR(255),
      picture VARCHAR(255),
      hd VARCHAR(255),
      access BOOLEAN DEFAULT FALSE
    )
  `;
  return executeTransaction([{ query, params: [] }]);
};

const insertUser = async (name, email, role, picture, hd, access = false) => {
  const query = `
    INSERT INTO Users (name, email, role, picture, hd, access)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const params = [name, email, role, picture, hd, access];
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

const updateUser = async (id, name, email, role, picture, hd, access) => {
  const query = `
    UPDATE Users
    SET name = $1, email = $2, role = $3, picture = $4, hd = $5, access = $6
    WHERE id = $7
    RETURNING *
  `;
  const params = [name, email, role, picture, hd, access, id];
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

const getTotalUsers = async () => {
  const query = 'SELECT COUNT(*) as total FROM Users';
  const result = await executeTransaction([{ query, params: [] }]);
  return result[0].total;
};

const getUserByEmail = async (email) => {
  const query = "SELECT * FROM Users WHERE email = $1";
  const params = [email];
  return executeTransaction([{ query, params }]);
};

module.exports = {
  createUserTable,
  insertUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  getTotalUsers,
  getUserByEmail,
};