import React from 'react';

const AssetDetailsModal = ({ selectedAsset, onClose }) => {
  if (!selectedAsset) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="relative bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl mx-4 lg:mx-8">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-3xl font-bold mb-6 text-gray-800">{selectedAsset.assetName}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-lg font-semibold text-gray-700"><strong>ID:</strong> {selectedAsset.assetID}</p>
            <p className="text-lg font-semibold text-gray-700"><strong>Date Created:</strong> {selectedAsset.createdDate}</p>
            <p className="text-lg font-semibold text-gray-700"><strong>Quantity:</strong> {selectedAsset.quantity}</p>
            <p className="text-lg font-semibold text-gray-700"><strong>Description:</strong> {selectedAsset.assetDetails}</p>
            <p className="text-lg font-semibold text-gray-700"><strong>Category:</strong> {selectedAsset.category}</p>
            <p className="text-lg font-semibold text-gray-700"><strong>Location:</strong> {selectedAsset.location}</p>
            <p className="text-lg font-semibold text-gray-700"><strong>Cost:</strong> {selectedAsset.cost}</p>
            <p className="text-lg font-semibold text-gray-700"><strong>Type:</strong> {selectedAsset.type}</p>
          </div>
          <div className="flex justify-center items-center">
            <img
              src={selectedAsset.image}
              alt={selectedAsset.assetName}
              className="w-full h-auto max-h-80 object-cover rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetailsModal;
