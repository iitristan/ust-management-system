const Category = require('../models/category');

const getCategories = async (req, res) => {
  try {
    const result = await Category.getCategories();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Error fetching categories", details: err.toString() });
  }
};

const addCategory = async (req, res) => {
  const { categoryName } = req.body;
  try {
    const result = await Category.addCategory(categoryName);
    res.status(201).json(result[0]);
  } catch (err) {
    res.status(500).json({ error: "Error adding category", details: err.toString() });
  }
};

const deleteCategory = async (req, res) => {
  const { categoryName } = req.params;
  try {
    const result = await Category.deleteCategory(categoryName);
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error deleting category", details: err.toString() });
  }
};

module.exports = {
  getCategories,
  addCategory,
  deleteCategory
};
