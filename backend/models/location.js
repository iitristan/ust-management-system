const { executeTransaction } = require('../utils/queryExecutor');

const createLocationsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Locations (
      id SERIAL PRIMARY KEY,
      location_name VARCHAR(255) UNIQUE NOT NULL
    )
  `;
  return executeTransaction([{ query, params: [] }]);
};

const getLocations = async () => {
  const query = "SELECT location_name FROM Locations";
  return executeTransaction([{ query, params: [] }]);
};

const addLocation = async (locationName) => {
  const query = "INSERT INTO Locations (location_name) VALUES ($1) RETURNING location_name";
  return executeTransaction([{ query, params: [locationName] }]);
};

const deleteLocation = async (locationName) => {
  const query = "DELETE FROM Locations WHERE location_name = $1 RETURNING location_name";
  return executeTransaction([{ query, params: [locationName] }]);
};

module.exports = {
  createLocationsTable,
  getLocations,
  addLocation,
  deleteLocation
};