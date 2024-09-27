const Asset = require('../models/asset');
const User = require('../models/user');

exports.getTotalAssets = async (req, res) => {
  try {
    const totalAssets = await Asset.getTotalAssets();
    res.json({ totalAssets });
  } catch (error) {
    console.error('Error getting total assets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.getTotalUsers();
    res.json({ totalUsers });
  } catch (error) {
    console.error('Error getting total users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
