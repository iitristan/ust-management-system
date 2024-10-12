const Role = require('../models/role');

const getRoles = async (req, res) => {
  try {
    const result = await Role.getRoles();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Error fetching roles", details: err.toString() });
  }
};

const addRole = async (req, res) => {
  const { roleName } = req.body;
  try {
    const result = await Role.addRole(roleName);
    res.status(201).json(result[0]);
  } catch (err) {
    res.status(500).json({ error: "Error adding role", details: err.toString() });
  }
};

const deleteRole = async (req, res) => {
  const { roleName } = req.params;
  try {
    const result = await Role.deleteRole(roleName);
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ error: "Role not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error deleting role", details: err.toString() });
  }
};

module.exports = {
  getRoles,
  addRole,
  deleteRole
};
