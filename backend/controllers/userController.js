const User = require('../models/user');

const createUser = async (req, res) => {
  try {
    const result = await User.createUser(req.body);
    res.status(201).json(result[0]);
  } catch (err) {
    res.status(500).json({ error: "Error creating user", details: err.toString() });
  }
};

const readUsers = async (req, res) => {
  try {
    const result = await User.readUsers();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Error reading users", details: err.toString() });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await User.updateUser(id, req.body);
    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error updating user", details: err.toString() });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await User.deleteUser(id);
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error deleting user", details: err.toString() });
  }
};

module.exports = {
  createUser,
  readUsers,
  updateUser,
  deleteUser
};
