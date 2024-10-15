import React, { useState, useEffect } from 'react';
import InputField from './inputfield';
import SelectField from './selectfield';
import Button from './button';
import axios from 'axios';

const EditAssetModal = ({
  isOpen,
  onClose,
  asset,
  categories = [],
  locations = [],
  onEditAsset,
}) => {
  const [editedAsset, setEditedAsset] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [totalCost, setTotalCost] = useState("");
  const [quantityForBorrowing, setQuantityForBorrowing] = useState(0);

  useEffect(() => {
    if (asset) {
      setEditedAsset(asset);
      setNewImage(null);
      calculateTotalCost(asset.quantity, asset.cost);
      setQuantityForBorrowing(asset.quantity_for_borrowing);
    }
  }, [asset]);

  const handleChange = (field, value) => {
    setEditedAsset(prev => ({ ...prev, [field]: value }));
    if (field === 'quantity' || field === 'cost') {
      calculateTotalCost(
        field === 'quantity' ? value : editedAsset.quantity,
        field === 'cost' ? value : editedAsset.cost
      );
    }
    if (field === 'quantityForBorrowing') {
      // Prevent setting quantity for borrowing to zero
      if (value < 1) {
        setQuantityForBorrowing(1); // Reset to 1 if the user tries to set it to zero
      } else {
        setQuantityForBorrowing(value);
      }
    }
  };

  const calculateTotalCost = (quantity, cost) => {
    if (quantity && cost) {
      const calculatedTotalCost = parseFloat(cost) * quantity;
      setTotalCost(calculatedTotalCost.toFixed(2));
    } else {
      setTotalCost("");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAsset = async () => {
    if (editedAsset) {
      try {
        if (quantityForBorrowing > editedAsset.quantity) {
          alert(`Quantity for borrowing cannot exceed available quantity of ${editedAsset.quantity}.`);
          setQuantityForBorrowing(editedAsset.quantity);
          return;
        }
        const updatedAsset = {
          ...editedAsset,
          image: newImage || editedAsset.image,
          totalCost: parseFloat(totalCost),
          quantityForBorrowing: editedAsset.is_active ? parseInt(quantityForBorrowing, 10) : 0
        };
        delete updatedAsset.lastUpdated;

        // Log only the changed fields
        const changedFields = Object.keys(updatedAsset).reduce((acc, key) => {
          if (key === 'quantityForBorrowing' && !editedAsset.is_active) {
            return acc; // Skip logging quantityForBorrowing if the asset is not active
          }
          if (key === 'totalCost') {
            // Only include totalCost if it has actually changed
            const oldTotalCost = parseFloat((asset.cost * asset.quantity).toFixed(2));
            const newTotalCost = parseFloat(updatedAsset.totalCost.toFixed(2));
            if (oldTotalCost !== newTotalCost) {
              acc[key] = {
                oldValue: oldTotalCost,
                newValue: newTotalCost
              };
            }
          } else if (JSON.stringify(updatedAsset[key]) !== JSON.stringify(asset[key])) {
            acc[key] = {
              oldValue: asset[key],
              newValue: updatedAsset[key]
            };
          }
          return acc;
        }, {});

        if (Object.keys(changedFields).length > 0) {
          const response = await axios.put(`${process.env.API_URL}/api/assets/update/${updatedAsset.asset_id}`, updatedAsset);
          console.log("Update response:", response.data);

          // Send changed fields to the backend
          await axios.post(`${process.env.API_URL}/api/asset-activity-logs`, {
            asset_id: updatedAsset.asset_id,
            action: 'update',
            changes: changedFields
          });

          onEditAsset(response.data);
        }
        onClose();
      } catch (error) {
        console.error("Error updating asset:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          Edit Asset
        </h2>
        {editedAsset && (
          <>
            <InputField
              label="Asset Name"
              value={editedAsset.assetName}
              onChange={(e) => handleChange('assetName', e.target.value)}
            />
            <InputField
              label="Asset Details"
              value={editedAsset.assetDetails}
              onChange={(e) => handleChange('assetDetails', e.target.value)}
            />
            <SelectField
              label="Asset Category"
              value={editedAsset.category}
              onChange={(e) => handleChange('category', e.target.value)}
              options={categories}
            />
            <SelectField
              label="Asset Location"
              value={editedAsset.location}
              onChange={(e) => handleChange('location', e.target.value)}
              options={locations}
            />
            <SelectField
              label="Asset Type"
              value={editedAsset.type}
              onChange={(e) => handleChange('type', e.target.value)}
              options={['Consumable', 'Non-Consumable']}
            />
            <InputField
              label="Quantity"
              type="number"
              value={editedAsset.quantity}
              onChange={(e) => handleChange('quantity', Number(e.target.value))}
            />
            <InputField
              label="Cost"
              value={editedAsset.cost}
              onChange={(e) => handleChange('cost', e.target.value.replace(/[^0-9.]/g, ""))}
              prefix="₱"
            />
            <InputField
              label="Total Cost"
              value={totalCost}
              prefix="₱"
              readOnly
            />
            {editedAsset.is_active && (
              <InputField
                label="Quantity for Borrowing"
                type="number"
                value={quantityForBorrowing}
                onChange={(e) => handleChange('quantityForBorrowing', Number(e.target.value))}
                min="1" // Ensure the input cannot be less than 1
              />
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Asset Image</label>
              {(newImage || editedAsset.image) && (
                <img
                  src={newImage || editedAsset.image}
                  alt="Asset"
                  className="w-full h-40 object-cover mb-2 rounded"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full"
              />
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <Button className="bg-gray-300" onClick={onClose}>
                Cancel
              </Button>
              <Button className="bg-blue-500 text-white" onClick={handleSaveAsset}>
                Save Changes
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditAssetModal;