const { executeTransaction } = require('../utils/queryExecutor');
const pool = require('../config/database');  // Adjust the path if necessary

const createEventsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Events (
      unique_id VARCHAR(20) PRIMARY KEY,
      event_name VARCHAR(100) NOT NULL,
      description TEXT,
      event_date DATE NOT NULL,
      event_start_time TIME NOT NULL,
      event_end_time TIME NOT NULL,
      event_location VARCHAR(255),
      image TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  return executeTransaction([{ query, params: [] }]);
};

const getLastUniqueId = async () => {
  const query = "SELECT unique_id FROM Events ORDER BY unique_id DESC LIMIT 1";
  const result = await executeTransaction([{ query, params: [] }]);
  return result[0]?.unique_id || 'OSA-EVENT-0000';
};

const generateNextUniqueId = async () => {
  const lastId = await getLastUniqueId();
  const numPart = parseInt(lastId.split('-')[2]);
  const nextNum = numPart + 1;
  return `OSA-EVENT-${nextNum.toString().padStart(4, '0')}`;
};

const createEvent = async (data) => {
  const uniqueId = await generateNextUniqueId();
  const columns = Object.keys(data).join(", ") + ", unique_id";
  const placeholders = Object.keys(data).map((_, i) => `$${i + 1}`).join(", ") + `, $${Object.keys(data).length + 1}`;
  const query = `INSERT INTO Events (${columns}) VALUES (${placeholders}) RETURNING *`;
  const params = [...Object.values(data), uniqueId];
  return executeTransaction([{ query, params }]);
};

const readEvents = async () => {
  const query = "SELECT * FROM Events ORDER BY unique_id";
  return executeTransaction([{ query, params: [] }]);
};

const updateEvent = async (uniqueId, data) => {
  const setString = Object.keys(data)
    .map((key, i) => `${key} = $${i + 1}`)
    .join(", ");
  const query = `UPDATE Events SET ${setString} WHERE unique_id = $${Object.keys(data).length + 1} RETURNING *`;
  const params = [...Object.values(data), uniqueId];
  return executeTransaction([{ query, params }]);
};

const deleteEvent = async (uniqueId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Delete the event
    const deleteQuery = "DELETE FROM Events WHERE unique_id = $1 RETURNING *";
    const deleteResult = await client.query(deleteQuery, [uniqueId]);

    if (deleteResult.rows.length > 0) {
      // Get all events with unique_id greater than the deleted event
      const selectQuery = "SELECT unique_id FROM Events WHERE unique_id > $1 ORDER BY unique_id";
      const selectResult = await client.query(selectQuery, [uniqueId]);

      // Update unique_ids of remaining events
      for (let i = 0; i < selectResult.rows.length; i++) {
        const updateUniqueId = selectResult.rows[i].unique_id;
        const newUniqueId = `OSA-EVENT-${(parseInt(updateUniqueId.split('-')[2]) - 1).toString().padStart(4, '0')}`;
        const updateQuery = "UPDATE Events SET unique_id = $1 WHERE unique_id = $2 RETURNING *";
        await client.query(updateQuery, [newUniqueId, updateUniqueId]);
      }

      // Get the updated events
      const updatedEventsQuery = "SELECT * FROM Events ORDER BY unique_id";
      const updatedEventsResult = await client.query(updatedEventsQuery);

      await client.query('COMMIT');
      return updatedEventsResult.rows;
    } else {
      await client.query('ROLLBACK');
      return [];
    }
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const getTotalEvents = async () => {
  const query = "SELECT COUNT(*) as total FROM Events";
  const result = await executeTransaction([{ query, params: [] }]);
  return result[0].total;
};

const getRecentEvents = async (limit = 5) => {
  try {
    const query = 'SELECT * FROM Events ORDER BY created_at DESC LIMIT $1';
    const result = await executeTransaction([{ query, params: [limit] }]);
    return result;
  } catch (error) {
    console.error('Error in getRecentEvents:', error);
    throw error;
  }
};

const addAssetsToEvent = async (eventId, assets) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const asset of assets) {
      console.log(`Processing asset ${asset.asset_id} for event ${eventId} with quantity ${asset.selectedQuantity}`);
      
      // Check if the asset already exists for this event
      const existingAssetQuery = 'SELECT * FROM event_assets WHERE event_id = $1 AND asset_id = $2';
      const existingAssetResult = await client.query(existingAssetQuery, [eventId, asset.asset_id]);
      
      if (existingAssetResult.rows.length > 0) {
        // Asset already exists, update its quantity
        const currentQuantity = existingAssetResult.rows[0].quantity;
        const newQuantity = currentQuantity + asset.selectedQuantity;
        await client.query(
          'UPDATE event_assets SET quantity = $1 WHERE event_id = $2 AND asset_id = $3',
          [newQuantity, eventId, asset.asset_id]
        );
        console.log(`Updated existing asset ${asset.asset_id} quantity from ${currentQuantity} to ${newQuantity}`);
      } else {
        // Asset doesn't exist, insert it
        await client.query(
          'INSERT INTO event_assets (event_id, asset_id, quantity) VALUES ($1, $2, $3)',
          [eventId, asset.asset_id, asset.selectedQuantity]
        );
        console.log(`Added new asset ${asset.asset_id} with quantity ${asset.selectedQuantity}`);
      }
      
      // Update asset quantity_for_borrowing
      console.log(`Updating asset ${asset.asset_id} quantity. Current: ${asset.quantity}, Deducting: ${asset.selectedQuantity}`);
      const newQuantity = asset.quantity - asset.selectedQuantity;
      await client.query(
        'UPDATE assets SET quantity = $1 WHERE asset_id = $2',
        [newQuantity, asset.asset_id]
      );
    }
    await client.query('COMMIT');
    console.log(`Assets successfully processed for event ${eventId}`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in addAssetsToEvent:', error);
    throw error;
  } finally {
    client.release();
  }
};

const createEventAssetsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS event_assets (
      id SERIAL PRIMARY KEY,
      event_id VARCHAR(20) REFERENCES Events(unique_id),
      asset_id VARCHAR(20) REFERENCES assets(asset_id),
      quantity INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try {
    await pool.query(query);
    console.log('event_assets table created successfully');
  } catch (error) {
    console.error('Error creating event_assets table:', error);
    throw error;
  }
};

const getEventAssets = async (eventId) => {
  const query = `
    SELECT ea.asset_id, ea.quantity, a.assetName
    FROM event_assets ea
    JOIN assets a ON ea.asset_id = a.asset_id
    WHERE ea.event_id = $1
  `;
  const result = await pool.query(query, [eventId]);
  return result.rows;
};

const getEventById = async (eventId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Fetch event details
    const eventQuery = 'SELECT * FROM Events WHERE unique_id = $1';
    const eventResult = await client.query(eventQuery, [eventId]);
    
    if (eventResult.rows.length === 0) {
      return null;
    }

    const event = eventResult.rows[0];

    // Fetch associated assets
    const assetsQuery = `
      SELECT a.asset_id, a."assetName", ea.quantity
      FROM event_assets ea
      JOIN assets a ON ea.asset_id = a.asset_id
      WHERE ea.event_id = $1
    `;
    const assetsResult = await client.query(assetsQuery, [eventId]);

    event.assets = assetsResult.rows;

    await client.query('COMMIT');
    return event;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in getEventById:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  createEventsTable,
  createEventAssetsTable,  // Make sure this line is here
  createEvent,
  readEvents,
  updateEvent,
  deleteEvent,
  getTotalEvents,
  getRecentEvents,
  addAssetsToEvent,
  createEventAssetsTable,
  getEventAssets,
  getEventById
};