const { executeTransaction } = require('../utils/queryExecutor');

const getLocations = async () => {
  const query = "SELECT location_name FROM Locations";
  return executeTransaction([{ query, params: [] }]);
};

const addLocation = async (locationName) => {
  const query = "INSERT INTO Locations (location_name) VALUES ($1) RETURNING *";
  return executeTransaction([{ query, params: [locationName] }]);
};

const deleteLocation = async (locationName) => {
  const query = "DELETE FROM Locations WHERE location_name = $1 RETURNING *";
  return executeTransaction([{ query, params: [locationName] }]);
};

module.exports = {
  getLocations,
  addLocation,
  deleteLocation
};
