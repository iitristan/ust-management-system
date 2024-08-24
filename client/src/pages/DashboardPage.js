import { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import LogoutButton from "../components/logout";

const clientId =
  "1072140054426-iucuc7c784kr4bvat2nkv8mvd865005s.apps.googleusercontent.com";

function Dashboard() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tableName, setTableName] = useState("Users"); // Set the table name here

  // Initialize Google API Client
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    }

    gapi.load("client:auth2", start);
  }, []);

  // Fetch data from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/${tableName}/read`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
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
  }, [tableName]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/${tableName}/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create record");
      }

      const newData = await response.json();
      setData([...data, newData]); // Add new data to the existing list
      setFormData({ name: "", email: "", role: "" }); // Reset form
    } catch (err) {
      console.error("Error creating record:", err);
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <p className="text-lg text-gray-600 mb-8">Welcome to your dashboard!</p>
        <LogoutButton />
      </header>

      {/* Form to create new data */}
      <form className="mb-8" onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="border px-4 py-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border px-4 py-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="role"
            placeholder="Role"
            value={formData.role}
            onChange={handleChange}
            className="border px-4 py-2 w-full"
            required
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
        {data.length > 0 ? (
          <table className="table-auto border-collapse w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Role</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border px-4 py-2">{item?.id ?? "N/A"}</td>
                  <td className="border px-4 py-2">{item?.name ?? "N/A"}</td>
                  <td className="border px-4 py-2">{item?.email ?? "N/A"}</td>
                  <td className="border px-4 py-2">{item?.role ?? "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No data available</div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
