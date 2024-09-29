const db = require('../db');

const AssetActivityLog = {
  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS asset_activity_log (
        id SERIAL PRIMARY KEY,
        asset_id INTEGER REFERENCES assets(asset_id),
        action TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER REFERENCES users(id)
      )
    `;
    await db.query(query);
  },

  logActivity: async (asset_id, action, user_id) => {
    const query = `
      INSERT INTO asset_activity_log (asset_id, action, user_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [asset_id, action, user_id];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  getActivityLogForAsset: async (asset_id) => {
    const query = `
      SELECT al.*, u.username
      FROM asset_activity_log al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE al.asset_id = $1
      ORDER BY al.timestamp DESC
    `;
    const result = await db.query(query, [asset_id]);
    return result.rows;
  }
};

module.exports = AssetActivityLog;
