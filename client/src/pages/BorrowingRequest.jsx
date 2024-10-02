import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BorrowingRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/borrowing-requests');
        setRequests(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch borrowing requests');
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/borrowing-requests/${id}/status`, { status });
      setRequests(requests.map(req => 
        req.id === id ? { ...req, status } : req
      ));
    } catch (err) {
      console.error('Error updating request status:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Borrowing Requests</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Department</th>
              <th className="py-2 px-4 border-b text-left">Purpose</th>
              <th className="py-2 px-4 border-b text-left">Borrowed Asset</th>
              <th className="py-2 px-4 border-b text-left">Quantity</th>
              <th className="py-2 px-4 border-b text-left">Cover Letter</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="py-2 px-4 border-b">{request.name}</td>
                <td className="py-2 px-4 border-b">{request.email}</td>
                <td className="py-2 px-4 border-b">{request.department}</td>
                <td className="py-2 px-4 border-b">{request.purpose}</td>
                <td className="py-2 px-4 border-b">{request.borrowed_asset_names}</td>
                <td className="py-2 px-4 border-b">{request.borrowed_asset_quantities}</td>
                <td className="py-2 px-4 border-b">
                  {request.cover_letter_url ? (
                    <a href={`http://localhost:5000${request.cover_letter_url}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      View Cover Letter
                    </a>
                  ) : (
                    'No cover letter'
                  )}
                </td>
                <td className="py-2 px-4 border-b">{request.status}</td>
                <td className="py-2 px-4 border-b">
                  <button 
                    className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() => handleStatusUpdate(request.id, 'Approved')}
                  >
                    Approve
                  </button>
                  <button 
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleStatusUpdate(request.id, 'Rejected')}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BorrowingRequest;