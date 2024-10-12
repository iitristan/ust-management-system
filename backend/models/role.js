const { executeTransaction } = require('../utils/queryExecutor');
const pool = require('../config/database');

const createRoleTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Role (
      id SERIAL PRIMARY KEY,
      role_name VARCHAR(255) UNIQUE NOT NULL
    )
  `;
  return executeTransaction([{ query, params: [] }]);
};

const getRoles = async () => {
  const query = "SELECT role_name FROM Role";
  return executeTransaction([{ query, params: [] }]);
};

const addRole = async (roleName) => {
  const query = "INSERT INTO Role (role_name) VALUES ($1) RETURNING role_name";
  return executeTransaction([{ query, params: [roleName] }]);
};

const deleteRole = async (roleName) => {
  const query = "DELETE FROM Role WHERE role_name = $1 RETURNING role_name";
  return executeTransaction([{ query, params: [roleName] }]);
};

module.exports = {
  getRoles,
  addRole,
  createRoleTable,
  deleteRole
};
    