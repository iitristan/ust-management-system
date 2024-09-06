import React from 'react';
import moment from 'moment';

const AssetDetailsModal = ({ selectedAsset, onClose }) => {
  if (!selectedAsset) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{selectedAsset.assetName}</h2>
          
          {selectedAsset.image && (
            <img 
              src={selectedAsset.image} 
              alt={selectedAsset.assetName} 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          )}

          <div className="space-y-3">
            <DetailItem label="ID" value={selectedAsset.asset_id} />
            <DetailItem label="Date Created" value={moment(selectedAsset.createdDate).format('MM/DD/YYYY')} />
            <DetailItem label="Quantity" value={selectedAsset.quantity} />
            <DetailItem label="Description" value={selectedAsset.assetDetails} />
            <DetailItem label="Category" value={selectedAsset.category} />
            <DetailItem label="Location" value={selectedAsset.location} />
            <DetailItem label="Cost" value={`₱${parseFloat(selectedAsset.cost).toFixed(2)}`} />
            <DetailItem label="Type" value={selectedAsset.type} />
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 py-2 last:border-b-0">
    <span className="font-semibold text-gray-600">{label}:</span>
    <span className="text-gray-800 sm:text-right">{value}</span>
  </div>
);

export default AssetDetailsModal;
