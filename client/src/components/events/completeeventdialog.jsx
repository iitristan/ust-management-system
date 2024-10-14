import React from 'react';
import axios from 'axios';

const CompletedEventsDialog = ({ isOpen, onClose, completedEvents, onEventDeleted }) => {
  console.log('CompletedEventsDialog props:', { isOpen, completedEvents });
  if (!isOpen) return null;

  // Sort completed events by date (most recent first)
  const sortedEvents = [...completedEvents].sort((a, b) => new Date(b.event_date) - new Date(a.event_date));

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`http://localhost:5000/api/Events/delete/${eventId}`);
      onEventDeleted(eventId);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };
// hello
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h2 className="text-lg font-bold mb-4">Completed Events</h2>
        {sortedEvents.length > 0 ? (
          <ul className="max-h-60 overflow-y-auto">
            {sortedEvents.map(event => (
              <li key={event.unique_id} className="mb-2 flex justify-between items-center">
                <span>{event.event_name} - {new Date(event.event_date).toLocaleDateString()}</span>
                <button
                  onClick={() => handleDeleteEvent(event.unique_id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No completed events yet.</p>
        )}
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CompletedEventsDialog;
