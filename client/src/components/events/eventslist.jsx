import { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import LogoutButton from "../logout";
import './eventlist.css';

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

  // Handle delete button click
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/Events/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      setData((prevData) => prevData.filter((event) => event.id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
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
    <main>
      <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: '#FFF2B2' }}>
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
          <div className="fixed inset-0 flex items-center justify-center z-50 rounded-md">
            <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay for dimming */}
            <dialog open className="relative bg-yellow-500 p-6 rounded-md shadow-lg z-50 rounded-2xl">
              <h2 className="text-2xl mb-4">New Event</h2>
              <form onSubmit={handleSubmit} className="space-y-4 w-96">
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
          </div>
        )}

        <div className="w-82 mx-auto p-6">
          <div className="grid grid-cols-3 gap-20 mb-10">
            {data.length > 0 ? (
              data.map((item) => (
                <div
                  key={item.id}
                  className="relative flex flex-col rounded-xl bg-amber-300 text-gray-700 shadow-md w-80 border-2 border-neutral-950 shadow-2xl"
                >
                  {/* header */}
                  <div className="relative mx-4 -mt-6 h-40 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
                  </div>

                  {/* body */}
                  <div className="p-6">
                    <h5 className="mb-2 text-xl font-semibold text-blue-gray-900">
                      {item.event_name}
                    </h5>
                    <p className="text-base font-light text-inherit">
                      {item.description}
                    </p>
                  </div>

                  {/* footer */}
                  <div className="p-6 pt-0 flex justify-between items-center">
                    <div className="button-container">
                      <button
                        className="button"
                        style={{ '--clr': '#0000ff' }}
                      >
                        <span className="button__icon-wrapper">
                          <svg
                            viewBox="0 0 14 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="button__icon-svg"
                            width="10"
                          >
                            <path
                              d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                              fill="currentColor"
                            ></path>
                          </svg>

                          <svg
                            viewBox="0 0 14 15"
                            fill="none"
                            width="10"
                            xmlns="http://www.w3.org/2000/svg"
                            className="button__icon-svg button__icon-svg--copy"
                          >
                            <path
                              d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </span>
                        Explore
                      </button>

                      <button onClick={() => handleDelete(item.id)} className="button1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 69 14"
                          className="svgIcon1 bin-top"
                        >
                          <g clipPath="url(#clip0_35_24)">
                            <path
                              fill="black"
                              d="M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734ZM64.0023 20.0648C64.0397 19.4882 63.5822 19 63.0044 19H5.99556C5.4178 19 4.96025 19.4882 4.99766 20.0648L8.19375 69.3203C8.44018 73.0758 11.6746 76 15.5712 76H53.4288C57.3254 76 60.5598 73.0758 60.8062 69.3203L64.0023 20.0648Z"
                            ></path>
                          </g>
                          <defs>
                            <clipPath id="clip0_35_24">
                              <rect fill="white" height="14" width="69"></rect>
                            </clipPath>
                          </defs>
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 69 57"
                          className="svgIcon1 bin-bottom"
                        >
                          <g clipPath="url(#clip0_35_22)">
                            <path
                              fill="black"
                              d="M20.8232 -16.3727L19.9948 -14.787C19.8224 -14.4569 19.4808 -14.25 19.1085 -14.25H4.92857C2.20246 -14.25 0 -12.1273 0 -9.5C0 -6.8727 2.20246 -4.75 4.92857 -4.75H64.0714C66.7975 -4.75 69 -6.8727 69 -9.5C69 -12.1273 66.7975 -14.25 64.0714 -14.25H49.8915C49.5192 -14.25 49.1776 -14.4569 49.0052 -14.787L48.1768 -16.3727C47.3451 -17.9906 45.6355 -19 43.7719 -19H25.2281C23.3645 -19 21.6549 -17.9906 20.8232 -16.3727ZM64.0023 1.0648C64.0397 0.4882 63.5822 0 63.0044 0H5.99556C5.4178 0 4.96025 0.4882 4.99766 1.0648L8.19375 50.3203C8.44018 54.0758 11.6746 57 15.5712 57H53.4288C57.3254 57 60.5598 54.0758 60.8062 50.3203L64.0023 1.0648Z"
                            ></path>
                          </g>
                          <defs>
                            <clipPath id="clip0_35_22">
                              <rect fill="white" height="57" width="69"></rect>
                            </clipPath>
                          </defs>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>No events available</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Events;
