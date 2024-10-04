import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment'; // Import moment

const BorrowingRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

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
      if (status === 'Rejected') {
        await axios.delete(`http://localhost:5000/api/borrowing-requests/${id}`);
        setRequests(requests.filter(req => req.id !== id)); // Remove from requests
      } else {
        // Update the status to Approved
        await axios.put(`http://localhost:5000/api/borrowing-requests/${id}/status`, { status: 'Approved' });
        // Update the requests state to reflect the approved status
        setRequests(prevRequests => 
          prevRequests.map(req => 
            req.id === id ? { ...req, status: 'Approved' } : req // Update the status of the approved request
          )
        );
      }
    } catch (err) {
      console.error('Error updating request status:', err);
    }
  };

  const handleReturnAsset = async (id, selectedAssets) => {
    try {
      await axios.put(`http://localhost:5000/api/borrowing-requests/${id}/return`);
    
      // Update the asset quantities back to the original
      await Promise.all(selectedAssets.map(async (asset) => {
        await axios.put(`http://localhost:5000/api/assets/${asset.asset_id}/quantity`, { quantityChange: asset.quantity });
      }));

      // Remove the request from the accepted requests
      setRequests(prevRequests => prevRequests.filter(req => req.id !== id));
    } catch (err) {
      console.error('Error returning asset:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Filter accepted requests
  const acceptedRequests = requests.filter(request => request.status === 'Approved');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Borrowing Requests</h1>
      <div className="overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Pending Requests</h2>
        <table className="min-w-full bg-white mb-6">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Department</th>
              <th className="py-2 px-4 border-b text-left">Purpose</th>
              <th className="py-2 px-4 border-b text-left">Borrowed Asset</th>
              <th className="py-2 px-4 border-b text-left">Quantity</th>
              <th className="py-2 px-4 border-b text-left">Cover Letter</th>
              <th className="py-2 px-4 border-b text-left">Expected Return Date</th>
              <th className="py-2 px-4 border-b text-left">Notes</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.filter(req => req.status === 'Pending').map((request) => (
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
                <td className="py-2 px-4 border-b">{moment(request.expectedReturnDate).format('MMMM Do YYYY')}</td>
                <td className="py-2 px-4 border-b">
                  <button onClick={() => handleStatusUpdate(request.id, 'Approved')} className="bg-green-500 text-white px-3 py-1 rounded mr-2">Approve</button>
                  <button onClick={() => handleStatusUpdate(request.id, 'Rejected')} className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold mb-4">Accepted Requests</h2>
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
              <th className="py-2 px-4 border-b text-left">Expected Return Date</th>
              <th className="py-2 px-4 border-b text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {acceptedRequests.map((request) => (
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
                <td className="py-2 px-4 border-b">{moment(request.expectedReturnDate).format('MMMM Do YYYY')}</td>
                <td className="py-2 px-4 border-b">{request.notes}</td>
                <td className="py-2 px-4 border-b">
                  <button onClick={() => handleReturnAsset(request.id, request.selected_assets)} className="bg-blue-500 text-white px-3 py-1 rounded">Returned</button>
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