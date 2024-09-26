import React, { useState } from 'react';
import '../../pages/eventlist1.css';

function EventCard({ item, handleExplore, handleDelete, handleEdit }) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const confirmDelete = () => {
    setShowConfirmDialog(true);
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
  };

  const executeDelete = () => {
    handleDelete(item.unique_id);
    setShowConfirmDialog(false);
  };

  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg h-48 md:h-64 lg:h-80 group">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundImage: `url(${item.image || '/default-event-image.jpg'})` }}
      ></div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 group-hover:bg-opacity-70"></div>
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-6 text-white">
        <div>
          <h2 className="text-2xl font-bold mb-2">{item.event_name}</h2>
          <p className="text-sm mb-2 line-clamp-2">{item.description}</p>
          <p className="text-xs">Event Date: {new Date(item.event_date).toLocaleDateString()}</p>
          <p className="text-xs">Created At:{new Date(item.created_at).toLocaleDateString()}</p>
        </div>
        
        <div className="flex justify-between items-center">
          <button 
            className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition-colors duration-300"
            onClick={() => handleExplore(item)}
          >
            Explore
          </button>
          
          <div className="space-x-2">
            <button 
              className="p-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors duration-300"
              onClick={() => handleEdit(item)}
            >
              Edit
            </button>
            <button 
              className="p-2 bg-red-500 rounded hover:bg-red-600 transition-colors duration-300"
              onClick={confirmDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <>
          <div className="confirmation-dialog-overlay" onClick={cancelDelete}></div>
          <div className="confirmation-dialog">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this event?</p>
            <div className="flex justify-end">
              <button
                className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={executeDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default EventCard;