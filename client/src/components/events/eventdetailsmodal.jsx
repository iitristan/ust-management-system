import React from 'react';

const EventDetailsModal = ({ selectedEvent, onClose, formatTime }) => {
  if (!selectedEvent) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center px-4">
      <div className="relative w-full max-w-md p-5 border shadow-lg rounded-md bg-white">
        <h2 className="text-2xl mb-4 font-bold">Event Details</h2>
        <div className="space-y-2">
          <p><strong className="font-semibold">Event Name:</strong> {selectedEvent.event_name}</p>
          <p><strong className="font-semibold">Description:</strong> {selectedEvent.description}</p>
          <p><strong className="font-semibold">Date:</strong> {new Date(selectedEvent.event_date).toLocaleDateString()}</p>
          <p><strong className="font-semibold">Start Time:</strong> {formatTime(selectedEvent.event_start_time)}</p>
          <p><strong className="font-semibold">End Time:</strong> {formatTime(selectedEvent.event_end_time)}</p>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EventDetailsModal;
