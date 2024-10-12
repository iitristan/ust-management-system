import { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import './eventlist1.css';
import AddEventButton from '../components/events/addeventbutton';
import EventDialog from '../components/events/eventdialog';
import ExploreModal from '../components/events/exploreevent';
import EventCard from '../components/events/eventcard';
import EditEventDialog from '../components/events/editeventdialog';
import SearchEvent from '../components/events/searchevent';
import axios from 'axios';  // Add this import
import CompletedEventsDialog from '../components/events/completeeventdialog';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const formatTime = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const date = new Date(2000, 0, 1, hours, minutes);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

function Events() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    event_name: "",
    description: "",
    event_date: "",
    event_start_time: "",
    event_end_time: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showExploreModal, setShowExploreModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [assets, setAssets] = useState([]);  // Add this line
  const [showCompletedEventsDialog, setShowCompletedEventsDialog] = useState(false);
  const [completedEvents, setCompletedEvents] = useState([]);

  const fetchCompletedEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events/completed');
      console.log('Fetched completed events:', response.data);
      setCompletedEvents(response.data);
    } catch (error) {
      console.error('Error fetching completed events:', error);
    }
  };

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    }

    gapi.load("client:auth2", start);

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

    const fetchAssets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/Assets/read');
        setAssets(response.data);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };

    fetchData();
    fetchAssets();
    fetchCompletedEvents();
  }, []);

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      event_name: event.event_name,
      description: event.description,
      event_date: event.event_date,
    });
    setShowEditDialog(true);
  };

  const filteredEvents = data.filter(event =>
    event.event_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/Events/update/${editingEvent.unique_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      const updatedEvent = await response.json();
      
      setData((prevData) =>
        prevData.map((event) =>
          event.unique_id === editingEvent.unique_id ? updatedEvent : event
        )
      );

      setFormData({ event_name: "", description: "", event_date: "" });
      setShowEditDialog(false);
      setEditingEvent(null);
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };

  const handleChange = (e, eventId = null) => {
    const { name, value } = e.target;
    if (eventId) {
      setData(prevData =>
        prevData.map(event =>
          event.unique_id === eventId
            ? { ...event, [name]: value }
            : event
        )
      );
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

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
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create event");
      }

      const newEvent = await response.json();
      setData((prevData) => [...prevData, newEvent]);
      setFormData({ event_name: "", description: "", event_date: "" });
      setShowDialog(false);
    } catch (err) {
      console.error("Error creating event:", err);
      alert(`Error creating event: ${err.message}`);
    }
  };

  const handleCompleteEvent = async (uniqueId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/events/${uniqueId}/complete`);
      if (response.status === 200) {
        const completedEvent = response.data.updatedEvent;
        
        // Remove the completed event from the main list
        setData(prevData => prevData.filter(event => event.unique_id !== uniqueId));
        
        // Immediately add the completed event to the completedEvents list
        setCompletedEvents(prevCompletedEvents => [...prevCompletedEvents, completedEvent]);
        
        console.log(`Event with ID ${uniqueId} marked as completed`);
        
        // Fetch updated asset list
        const assetResponse = await axios.get('http://localhost:5000/api/Assets/read');
        setAssets(assetResponse.data);
        
        // Fetch all completed events to ensure consistency
        fetchCompletedEvents();
      }
    } catch (err) {
      console.error("Error completing event:", err);
      alert(`Error completing event: ${err.message}`);
    }
  };

  const handleExplore = async (event) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/events/${event.unique_id}`);
      setSelectedEvent(response.data);
      setShowExploreModal(true);
    } catch (error) {
      console.error('Error fetching event details:', error);
      // You might want to show an error message to the user here
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
  };


  const cancelEdit = () => {
    setShowEditDialog(false);
    setFormData({ event_name: "", description: "", event_date: "" });
  };

  const cancelCreate = () => {
    setShowDialog(false);
    setFormData({ event_name: "", description: "", event_date: "" });
  };

  const handleAddAsset = async (event, selectedAssets) => {
    try {
      console.log(`Adding assets to event ${event.unique_id}:`, selectedAssets);
      const response = await axios.post(`http://localhost:5000/api/events/${event.unique_id}/addAssets`, {
        assets: selectedAssets
      });

      if (response.data.success) {
        // Update the local state
        setData(prevData => prevData.map(e => {
          if (e.unique_id === event.unique_id) {
            const updatedAssets = e.assets ? [...e.assets] : [];
            selectedAssets.forEach(newAsset => {
              const existingAssetIndex = updatedAssets.findIndex(a => a.asset_id === newAsset.asset_id);
              if (existingAssetIndex !== -1) {
                // Asset already exists, update its quantity
                updatedAssets[existingAssetIndex].quantity += newAsset.selectedQuantity;
              } else {
                // Asset doesn't exist, add it to the list
                updatedAssets.push({
                  ...newAsset,
                  quantity: newAsset.selectedQuantity
                });
              }
            });
            return { ...e, assets: updatedAssets };
          }
          return e;
        }));
        console.log(`Assets successfully added to event ${event.event_name}`);
      }
    } catch (error) {
      console.error("Error adding assets to event:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      }
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  const handleAddEvent = () => {
    setFormData({ event_name: "", description: "", event_date: "" });
    setShowDialog(true);
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: '#FFF2B2' }}>
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Events</h1>
          <p className="text-lg text-gray-600 mb-8">Manage your events here!</p>
        </header>

        <SearchEvent searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <AddEventButton onAddEvent={handleAddEvent} />

        <EventDialog
          showDialog={showDialog}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          setShowDialog={setShowDialog}
          isEditing={!!editingEvent}
          cancelCreate={cancelCreate}
        />
        
        <ExploreModal
          showExploreModal={showExploreModal}
          selectedEvent={selectedEvent}
          setShowExploreModal={setShowExploreModal}
        />

        <EditEventDialog
          showDialog={showEditDialog}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleEditSubmit}
          setShowDialog={setShowEditDialog}
          cancelEdit={cancelEdit}
        />

        <div className="w-82 mx-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((item) => (
                <div key={item.unique_id} className="h-full">
                  <EventCard
                    item={item}
                    handleExplore={handleExplore}
                    handleComplete={handleCompleteEvent}
                    handleEdit={handleEdit}
                    cancelDelete={cancelDelete}
                    formatTime={formatTime}
                    handleAddAsset={handleAddAsset}
                    assets={assets}
                    setShowConfirmDialog={setShowConfirmDialog}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">No events available</div>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowCompletedEventsDialog(true)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4"
        >
          Show Completed Events
        </button>

        <CompletedEventsDialog
          isOpen={showCompletedEventsDialog}
          onClose={() => setShowCompletedEventsDialog(false)}
          completedEvents={completedEvents}
        />
      </div>
    </main>
  );
}

export default Events;