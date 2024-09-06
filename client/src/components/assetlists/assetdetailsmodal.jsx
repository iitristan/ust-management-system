import React from 'react';
import moment from 'moment';

const AssetDetailsModal = ({ selectedAsset, onClose }) => {
  if (!selectedAsset) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{selectedAsset.assetName}</h2>
        <p><strong>ID:</strong> {selectedAsset.asset_id}</p>
        <p><strong>Date Created:</strong> {moment(selectedAsset.createdDate).format('MM/DD/YYYY')}</p>
        <p><strong>Quantity:</strong> {selectedAsset.quantity}</p>
        <p><strong>Description:</strong> {selectedAsset.assetDetails}</p>
        <p><strong>Category:</strong> {selectedAsset.category}</p>
        <p><strong>Location:</strong> {selectedAsset.location}</p>
        <p><strong>Cost:</strong> ₱{parseFloat(selectedAsset.cost).toFixed(2)}</p>
        <p><strong>Type:</strong> {selectedAsset.type}</p>
        {selectedAsset.image && (
          <img src={selectedAsset.image} alt={selectedAsset.assetName} className="mt-4 max-w-full h-auto" />
        )}
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AssetDetailsModal;
