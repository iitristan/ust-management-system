import { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import LogoutButton from "../components/logout";

const clientId = "1072140054426-iucuc7c784kr4bvat2nkv8mvd865005s.apps.googleusercontent.com";

function Events() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({ event_name: "", description: "", event_date: "" });

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    }

    gapi.load("client:auth2", start);

    // Fetch data from the backend API
    fetch("http://localhost:5000/api/read")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target; 
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((newData) => {
        setData([...data, newData]); // Add new data to the existing data list
        setFormData({ event_name: "", description: "", event_date: "" }); // Reset form fields
      })
      .catch((error) => console.error("Error creating record:", error));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Event!</h1>
        <p className="text-lg text-gray-600 mb-8">Manage your Events here!</p>
        <LogoutButton />
      </header>

      {/* Form to create new data */}
      <form className="mb-8" onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            name="event_name"
            placeholder="Event Name"
            value={formData.event_name}
            onChange={handleChange}
            className="border px-4 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border px-4 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <input
            type="date"
            name="event_date"
            placeholder="Date Createed"
            value={formData.event_date}
            onChange={handleChange}
            className="border px-4 py-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Record
        </button>
      </form>

      {/* Display fetched data in table form */}
      <div className="overflow-x-auto w-full">
        <h2 className="text-2xl font-bold mb-4">Data from Database:</h2>
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Event Name</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Date of Event</th>
              <th className="px-4 py-2 border">Date of Creation</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{item.id}</td>
                <td className="border px-4 py-2">{item.event_name}</td>
                <td className="border px-4 py-2">{item.description}</td>
                <td className="border px-4 py-2">{item.event_date}</td>
                <td className="border px-4 py-2">{item.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Events;
