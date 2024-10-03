const { executeTransaction } = require('../utils/queryExecutor');
const pool = require('../config/database');

class BorrowingRequest {
  static async createBorrowingRequestTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS borrowing_requests (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        department VARCHAR(255) NOT NULL,
        purpose TEXT NOT NULL,
        contact_no VARCHAR(20) NOT NULL,
        cover_letter_path TEXT,
        selected_assets JSONB NOT NULL,
        status VARCHAR(20) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    return executeTransaction([{ query, params: [] }]);
  }

  static async createBorrowingRequest(requestData) {
    const query = `
      INSERT INTO borrowing_requests (
        name, email, department, purpose, contact_no, cover_letter_path, selected_assets, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `;
    const params = [
      requestData.name,
      requestData.email,
      requestData.department,
      requestData.purpose,
      requestData.contactNo,
      requestData.coverLetterPath,
      JSON.stringify(requestData.selectedAssets),
      'Pending'
    ];
    console.log('Executing query with params:', params);
    try {
      const result = await executeTransaction([{ query, params }]);
      return result[0];
    } catch (error) {
      console.error('Error in createBorrowingRequest:', error);
      throw error;
    }
  }

  static async getAllBorrowingRequests() {
    const query = `
      SELECT *
      FROM borrowing_requests
      WHERE jsonb_array_length(selected_assets) > 0
      ORDER BY created_at DESC
    `;
    const result = await executeTransaction([{ query }]);
    return result.map(row => ({
      ...row,
      borrowed_asset_names: row.selected_assets.map(asset => asset.assetName).join(', '),
      borrowed_asset_quantities: row.selected_assets.map(asset => asset.quantity).join(', '),
      cover_letter_url: row.cover_letter_path ? `/api/borrowing-requests/${row.id}/cover-letter` : null
    }));
  }

  static async updateBorrowingRequestStatus(requestId, status) {
    const query = 'UPDATE borrowing_requests SET status = $1 WHERE id = $2 RETURNING *';
    const params = [status, requestId];
    const result = await executeTransaction([{ query, params }]);
    return result[0];
  }

  static async getBorrowingRequestById(id) {
    const query = 'SELECT * FROM borrowing_requests WHERE id = $1';
    const result = await executeTransaction([{ query, params: [id] }]);
    return result[0];
  }
}

module.exports = BorrowingRequest;
