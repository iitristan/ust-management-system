import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';


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
      if (status === 'Rejected') {
        await axios.delete(`http://localhost:5000/api/borrowing-requests/${id}`);
      } else {
        await axios.put(`http://localhost:5000/api/borrowing-requests/${id}/status`, { status: 'Approved' });
      }
      // Refresh the data
      const response = await axios.get('http://localhost:5000/api/borrowing-requests');
      setRequests(response.data);
    } catch (err) {
      console.error('Error updating request status:', err);
    }
  };

  const handleReturnAsset = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/borrowing-requests/${id}/return`);
      // Refresh the data
      const response = await axios.get('http://localhost:5000/api/borrowing-requests');
      setRequests(response.data);
    } catch (err) {
      console.error('Error returning asset:', err);
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  const pendingRequests = requests.filter(req => req.status === 'Pending');
  const acceptedRequests = requests.filter(req => req.status === 'Approved');

  const renderTable = (title, data, showActions) => (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Department</th>
              <th scope="col" className="px-6 py-3">Purpose</th>
              <th scope="col" className="px-6 py-3">Borrowed Asset</th>
              <th scope="col" className="px-6 py-3">Quantity</th>
              <th scope="col" className="px-6 py-3">Cover Letter</th>
              <th scope="col" className="px-6 py-3">Expected Return Date</th>
              {showActions && <th scope="col" className="px-6 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((request) => (
              <tr key={request.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{request.name}</td>
                <td className="px-6 py-4">{request.email}</td>
                <td className="px-6 py-4">{request.department}</td>
                <td className="px-6 py-4">{request.purpose}</td>
                <td className="px-6 py-4">{request.borrowed_asset_names}</td>
                <td className="px-6 py-4">{request.borrowed_asset_quantities}</td>
                <td className="px-6 py-4">
                  {request.cover_letter_url ? (
                    <a href={`http://localhost:5000${request.cover_letter_url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View Cover Letter
                    </a>
                  ) : (
                    'No cover letter'
                  )}
                </td>
                <td className="px-6 py-4">{moment(request.expectedReturnDate).format('MMMM Do YYYY')}</td>
                {showActions && (
                  <td className="px-6 py-4">
                    {request.status === 'Pending' ? (
                      <>
                        <button onClick={() => handleStatusUpdate(request.id, 'Approved')} className="bg-green-500 text-white px-3 py-1 rounded mr-2 text-xs">Approve</button>
                        <button onClick={() => handleStatusUpdate(request.id, 'Rejected')} className="bg-red-500 text-white px-3 py-1 rounded text-xs">Reject</button>
                      </>
                    ) : (
                      <button onClick={() => handleReturnAsset(request.id)} className="bg-blue-500 text-white px-3 py-1 rounded text-xs">Returned</button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="container w-full md:w-4/5 xl:w-3/5 mx-auto px-2">
      <h1 className="flex items-center font-sans font-bold break-normal text-indigo-500 px-2 py-8 text-xl md:text-2xl">
        Borrowing Requests
      </h1>

      <div id='recipients' className="p-8 mt-6 lg:mt-0 rounded shadow bg-white">
        {renderTable("Pending Requests", pendingRequests, true)}
        {renderTable("Accepted Requests", acceptedRequests, true)}
      </div>
    </div>
  );
};

export default BorrowingRequest;
