import React from 'react';

function BorroSelectModal({ isOpen, onClose, activeAssets, onSelectMaterial }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-3xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Select Asset to Borrow</h2>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {activeAssets.map((asset) => (
            <div key={asset.asset_id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow duration-200">
              <div>
                <p className="font-bold text-lg text-gray-800">{asset.assetName}</p>
                <p className="text-sm text-gray-600">
                  Available for borrowing: <span className="font-semibold text-blue-600">
                    {console.log("Asset data in BorroSelectModal:", JSON.stringify(asset, null, 2))}
                    {asset.quantity_for_borrowing !== undefined ? asset.quantity_for_borrowing : 'N/A'}
                  </span>
                </p>
              </div>
              <button 
                className="bg-yellow-500 text-white px-6 py-2 rounded-full shover:bg-yellow-600 transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => onSelectMaterial(asset.assetName)}
                disabled={asset.quantity_for_borrowing === 0}
              >
                Select
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-8 w-full bg-gray-200 text-gray-800 py-3 rounded-full hover:bg-gray-300 transition-colors duration-200 font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default BorroSelectModal;
