const Location = require('../models/location');

const getLocations = async (req, res) => {
  try {
    const result = await Location.getLocations();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Error fetching locations", details: err.toString() });
  }
};

const addLocation = async (req, res) => {
  const { locationName } = req.body;
  try {
    const result = await Location.addLocation(locationName);
    res.status(201).json(result[0]);
  } catch (err) {
    res.status(500).json({ error: "Error adding location", details: err.toString() });
  }
};

const deleteLocation = async (req, res) => {
  const { locationName } = req.params;
  try {
    const result = await Location.deleteLocation(locationName);
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ error: "Location not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error deleting location", details: err.toString() });
  }
};

module.exports = {
  getLocations,
  addLocation,
  deleteLocation
};