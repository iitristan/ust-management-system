import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";

const AssetTable = ({
  assets,
  onDeleteAsset,
  onEditAsset,
  activeAssetIDs,
  setActiveAssetIDs,
  onAllocateAsset,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [allocateData, setAllocateData] = useState({}); // State for allocation input

  const handleBorrowClick = (assetID) => {
    setActiveAssetIDs((prevIDs) =>
      prevIDs.includes(assetID)
        ? prevIDs.filter((id) => id !== assetID)
        : [...prevIDs, assetID]
    );
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
  };

  const handleAssetNameClick = (asset) => {
    setSelectedAsset(asset);
  };

  const handleCloseAssetModal = () => {
    setSelectedAsset(null);
  };

  const handleAllocateClick = (assetID) => {
    setAllocateData((prevData) => ({
      ...prevData,
      [assetID]: prevData[assetID] ? undefined : 0,
    }));
  };

  const handleAllocateChange = (assetID, allocation) => {
    setAllocateData((prevData) => ({
      ...prevData,
      [assetID]: allocation,
    }));
  };

  const handleApplyAllocation = (assetID) => {
    const allocation = allocateData[assetID];
    if (allocation >= 0) {
      onAllocateAsset(assetID, allocation);
      setAllocateData((prevData) => ({
        ...prevData,
        [assetID]: undefined,
      }));
    }
  };

  return (
    <div className="relative p-4 w-full bg-white border border-gray-200 rounded-lg shadow-md font-roboto text-[20px]">
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="text-[20px] font-medium">ID</th>
            <th className="text-[20px] font-medium">Date Created</th>
            <th className="text-[20px] font-medium">Asset</th>
            <th className="text-[20px] font-medium">Quantity</th>
            <th className="text-[20px] font-medium">Borrow</th>
            <th className="text-[20px] font-medium">Allocate</th>
            <th className="text-[20px] font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {assets.map((asset) => (
            <tr key={asset.assetID}>
              <td>{asset.assetID}</td>
              <td>{asset.createdDate}</td>
              <td>
                <div className="flex items-center justify-center">
                  {asset.image && (
                    <img
                      src={asset.image}
                      alt={asset.assetName}
                      className="h-8 w-8 object-cover mr-2 cursor-pointer"
                      onClick={() => handleImageClick(asset.image)}
                    />
                  )}
                  <span
                    className="cursor-pointer text-blue-600 hover:underline"
                    onClick={() => handleAssetNameClick(asset)}
                  >
                    {asset.assetName}
                  </span>
                </div>
              </td>
              <td>{asset.quantity}</td>
              <td>
                <div className="flex items-center justify-center">
                  <button
                    className={`w-4 h-4 rounded-full border-2 border-gray-400 ${
                      activeAssetIDs.includes(asset.assetID) ? "bg-blue-500" : "bg-white"
                    } shadow-md transition-transform transform ${
                      activeAssetIDs.includes(asset.assetID) ? "scale-110" : "scale-100"
                    }`}
                    onClick={() => handleBorrowClick(asset.assetID)}
                    aria-label={`Borrow ${asset.assetID}`}
                  ></button>
                </div>
              </td>
              <td>
                <div className="flex items-center justify-center">
                  {allocateData[asset.assetID] !== undefined ? (
                    <div className="flex items-center">
                      <input
                        type="number"
                        className="w-16 p-1 border border-gray-300 rounded"
                        min="0"
                        max={asset.quantity}
                        value={allocateData[asset.assetID]}
                        onChange={(e) =>
                          handleAllocateChange(asset.assetID, parseInt(e.target.value, 10))
                        }
                      />
                      <button
                        className="ml-2 bg-blue-500 text-white py-1 px-2 rounded"
                        onClick={() => handleApplyAllocation(asset.assetID)}
                      >
                        Apply
                      </button>
                    </div>
                  ) : (
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="text-green-500 cursor-pointer"
                      onClick={() => handleAllocateClick(asset.assetID)}
                      aria-label={`Allocate ${asset.assetID}`}
                    />
                  )}
                </div>
              </td>
              <td>
                <div className="flex items-center justify-center space-x-2">
                  <button
                    className="text-black-600 flex items-center space-x-1"
                    onClick={() => onEditAsset(asset)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="text-black-600 flex items-center space-x-1"
                    onClick={() => onDeleteAsset(asset.assetID)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for enlarged image */}
      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75 text-center">
          <div className="relative bg-white p-4 rounded-lg shadow-lg">
            <img
              src={selectedImage}
              alt="Enlarged Asset"
              className="h-96 w-96 object-cover"
            />
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={handleCloseImageModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal for asset details */}
      {selectedAsset && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75 text-center">
          <div className="relative bg-white p-6 rounded-lg shadow-lg">
            <div className="modal-header flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedAsset.assetName}</h2>
              <button
                className="text-gray-600 text-xl"
                onClick={handleCloseAssetModal}
              >
                &times;
              </button>
            </div>
            <div className="modal-body mb-4">
              {selectedAsset.image && (
                <img
                  src={selectedAsset.image}
                  alt={selectedAsset.assetName}
                  className="w-full h-auto mb-4"
                />
              )}
              <p><strong>ID:</strong> {selectedAsset.assetID}</p>
              <p><strong>Date Created:</strong> {selectedAsset.createdDate}</p>
              <p><strong>Details:</strong> {selectedAsset.assetDetails}</p>
              <p><strong>Category:</strong> {selectedAsset.selectedCategory}</p>
              <p><strong>Location:</strong> {selectedAsset.selectedLocation}</p>
              <p><strong>Quantity:</strong> {selectedAsset.quantity}</p>
              <p><strong>Cost:</strong> ₱{selectedAsset.cost}</p>
            </div>
            <div className="modal-footer">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded"
                onClick={handleCloseAssetModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetTable;
