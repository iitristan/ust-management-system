import React from 'react';

const AddEventButton = ({ onAddEvent }) => {
  return (
    <button
      onClick={onAddEvent}
      className="bg-green-500 text-white px-4 py-2 rounded mb-4"
    >
      Add New Event
    </button>
  );
};

export default AddEventButton;