import { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import LogoutButton from "../components/logout";

const clientId =
  "1072140054426-iucuc7c784kr4bvat2nkv8mvd865005s.apps.googleusercontent.com";

function Events() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    event_name: "",
    description: "",
    event_date: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false); // State to control dialog visibility

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    }

    gapi.load("client:auth2", start);

    // Fetch data from the backend API
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/Events/read");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/Events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      const newEvent = await response.json();
      setData((prevData) => [...prevData, newEvent]); // Add new event to the existing list
      setFormData({ event_name: "", description: "", event_date: "" }); // Reset form fields
      setShowDialog(false); // Close the dialog after submission
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  // Handle loading and error states
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Events</h1>
        <p className="text-lg text-gray-600 mb-8">Manage your events here!</p>
        <LogoutButton />
      </header>

      {/* Button to open the modal */}
      <button
        onClick={() => setShowDialog(true)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Add New Event
      </button>

      {/* Dialog box for the form */}
      {showDialog && (
        <dialog open className="bg-white p-6 rounded-md shadow-lg">
          <h2 className="text-2xl mb-4">Create New Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="event_name"
                placeholder="Event Name"
                value={formData.event_name}
                onChange={handleChange}
                className="border px-4 py-2 w-full"
                required
              />
            </div>
            <div>
              <textarea
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="border px-4 py-2 w-full"
                required
              />
            </div>
            <div>
              <input
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
                className="border px-4 py-2 w-full"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowDialog(false)} // Close dialog on cancel
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Event
              </button>
            </div>
          </form>
        </dialog>
      )}

      {/* Display fetched data in table form */}
      <div className="overflow-x-auto w-full">
        <h2 className="text-2xl font-bold mb-4">Events List</h2>
        {data.length > 0 ? (
          <table className="table-auto border-collapse w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Event Name</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Event Date</th>
                <th className="px-4 py-2 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="text-center">
                  <td className="border px-4 py-2">{item.id}</td>
                  <td className="border px-4 py-2">{item.event_name}</td>
                  <td className="border px-4 py-2">{item.description}</td>
                  <td className="border px-4 py-2">{item.event_date}</td>
                  <td className="border px-4 py-2">{item.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No events available</div>
        )}
      </div>
    </div>
  );
}

export default Events;
