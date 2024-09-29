import React from 'react';

const EventDialog = ({ showDialog, formData, handleChange, handleSubmit, setShowDialog }) => {
  if (!showDialog) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange({ target: { name: 'image', value: reader.result } });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 rounded-md">
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay for dimming */}
      <dialog open className="relative bg-stone-100 p-6 rounded-md shadow-lg z-50 rounded-2xl">
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Event Start Time</label>
            <input
              type="time"
              name="event_start_time"
              value={formData.event_start_time}
              onChange={handleChange}
              className="border px-4 py-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Event End Time</label>
            <input
              type="time"
              name="event_end_time"
              value={formData.event_end_time}
              onChange={handleChange}
              className="border px-4 py-2 w-full"
              required
            />
          </div>
          {/* New image upload input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Event Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1 block w-full"
            />
            {formData.image && (
              <img src={formData.image} alt="Event" className="mt-2 h-32 w-full object-cover rounded" />
            )}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowDialog(false)}
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
  );
};

export default EventDialog;