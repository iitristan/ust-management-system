const { executeTransaction } = require('../utils/queryExecutor');

const createCategoriesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Categories (
      id SERIAL PRIMARY KEY,
      category_name VARCHAR(255) UNIQUE NOT NULL
    )
  `;
  return executeTransaction([{ query, params: [] }]);
};

const getCategories = async () => {
  const query = "SELECT category_name FROM Categories";
  return executeTransaction([{ query, params: [] }]);
};

const addCategory = async (categoryName) => {
  const query = "INSERT INTO Categories (category_name) VALUES ($1) RETURNING category_name";
  return executeTransaction([{ query, params: [categoryName] }]);
};

const deleteCategory = async (categoryName) => {
  const query = "DELETE FROM Categories WHERE category_name = $1 RETURNING category_name";
  return executeTransaction([{ query, params: [categoryName] }]);
};

module.exports = {
  getCategories,
  addCategory,
  createCategoriesTable,
  deleteCategory
};
