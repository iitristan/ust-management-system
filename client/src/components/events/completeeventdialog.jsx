import React from 'react';
import axios from 'axios';

const CompletedEventsDialog = ({ isOpen, onClose, completedEvents, onEventDeleted }) => {
  if (!isOpen) return null;

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`http://localhost:5000/api/Events/delete/${eventId}`);
      onEventDeleted(eventId);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert(`Failed to delete event. Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const sortedEvents = [...completedEvents].sort((a, b) => new Date(b.event_date) - new Date(a.event_date));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Completed Events</h2>
        {sortedEvents.length === 0 ? (
          <p>No completed events to display.</p>
        ) : (
          <div className="space-y-6">
            {sortedEvents.map(event => (
              <div key={event.unique_id} className="bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{event.event_name}</h3>
                  <span className="text-sm text-gray-600">Event Date:{new Date(event.event_date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">Location: {event.event_location}</p>
                <h4 className="font-medium mb-2">Assets Used:</h4>
                {event.assets && event.assets.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {event.assets.map((asset, index) => (
                      <li key={index} className="text-sm">
                        {asset.assetName}: {asset.quantity}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No assets used for this event.</p>
                )}
                <button
                  onClick={() => handleDeleteEvent(event.unique_id)}
                  className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                >
                  Delete Event
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CompletedEventsDialog;