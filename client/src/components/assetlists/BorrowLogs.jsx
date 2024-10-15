import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const BorrowLogs = ({ assetId, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBorrowLogs = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:5000/api/borrow-logs/${assetId}`);
        console.log('Fetched borrow logs:', response.data);
        setLogs(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching borrow logs:", error.response ? error.response.data : error.message);
        setError("Failed to fetch borrow logs. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchBorrowLogs();
  }, [assetId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Borrow Logs</h2>
        {isLoading ? (
          <p>Loading borrow logs...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="space-y-4">
            {logs.map((log, index) => (
              <div key={index} className="bg-gray-100 p-3 rounded-lg mb-2">
                <p className="font-semibold">Borrowed on: {new Date(log.date_borrowed).toLocaleDateString()}</p>
                <p>Borrower: {log.borrower_name}</p>
                <p>Email: {log.borrower_email}</p>
                <p>Department: {log.borrower_department}</p>
                <p>Quantity Borrowed: {log.quantity_borrowed}</p>
                <p>Returned: {log.date_returned ? new Date(log.date_returned).toLocaleDateString() : 'Not yet returned'}</p>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BorrowLogs;
