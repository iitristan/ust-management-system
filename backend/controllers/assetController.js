const Asset = require('../models/asset');

const createAsset = async (req, res) => {
  try {
    const result = await Asset.createAsset(req.body);
    res.status(201).json(result[0]);
  } catch (err) {
    res.status(500).json({ error: "Error creating asset", details: err.toString() });
  }
};

const readAssets = async (req, res) => {
  try {
    const result = await Asset.readAssets();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Error reading assets", details: err.toString() });
  }
};

const updateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Asset.updateAsset(req.body, id);
    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json({ error: "Asset not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error updating asset", details: err.toString() });
  }
};

const deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Asset.deleteAsset(id);
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ error: "Asset not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error deleting asset", details: err.toString() });
  }
};

const updateAssetActiveStatus = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  try {
    const result = await Asset.updateAssetActiveStatus(id, isActive);
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ error: "Asset not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error updating asset active status", details: err.toString() });
  }
};

const getTotalActiveAssets = async (req, res) => {
  try {
    const count = await Asset.getTotalActiveAssets();
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ error: "Error getting total active assets", details: err.toString() });
  }
};

const getTotalAvailableAssets = async (req, res) => {
  try {
    const count = await Asset.getTotalAvailableAssets();
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ error: "Error getting total available assets", details: err.toString() });
  }
};

const getAssetsSortedByActiveStatus = async (req, res) => {
  const { sortOrder } = req.query;
  try {
    const result = await Asset.getAssetsSortedByActiveStatus(sortOrder);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Error getting sorted assets", details: err.toString() });
  }
};

module.exports = {
  createAsset,
  readAssets,
  updateAsset,
  deleteAsset,
  updateAssetActiveStatus,
  getTotalActiveAssets,
  getTotalAvailableAssets,
  getAssetsSortedByActiveStatus
};
