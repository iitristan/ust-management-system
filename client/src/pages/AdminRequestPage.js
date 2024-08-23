import { useEffect, useState } from "react";

function AdminRequestPage() {
  const [requests, setRequests] = useState([]);

  // Fetch all requests
  useEffect(() => {
    fetch("/api/requests")
      .then((response) => response.json())
      .then((data) => setRequests(data))
      .catch((error) => console.error("Error fetching requests:", error));
  }, []);

  // Handle Approve Request
  const handleApprove = (id) => {
    fetch(`/api/requests/approve/${id}`, { method: "POST" })
      .then((response) => response.text())
      .then(() => {
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === id ? { ...req, status: "approved" } : req
          )
        );
      })
      .catch((error) => console.error("Error approving request:", error));
  };

  // Handle Decline Request
  const handleDecline = (id) => {
    fetch(`/api/requests/decline/${id}`, { method: "POST" })
      .then((response) => response.text())
      .then(() => {
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === id ? { ...req, status: "declined" } : req
          )
        );
      })
      .catch((error) => console.error("Error declining request:", error));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Access Requests</h1>
      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white"
          >
            <h2 className="text-xl font-semibold mb-2">{request.name}</h2>
            <p className="text-gray-600">Department: {request.department}</p>
            <p className="text-gray-600">Material: {request.material}</p>
            <p className="text-gray-600">Purpose: {request.purpose}</p>
            <p className="text-gray-600">
              Status: <span className="font-bold">{request.status}</span>
            </p>
            {request.status === "pending" && (
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => handleApprove(request.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecline(request.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Decline
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminRequestPage;
