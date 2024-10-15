// Modal.js
import React, { useState, useEffect } from 'react';
import InputField from './inputfield';
import SelectField from './selectfield';
import Button from './button';
import axios from 'axios';
import moment from 'moment';  // Import moment






// CSS for shaking animation
const shakeStyle = `
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}

.shake {
  animation: shake 0.5s;
}
`;

// Add style to the document head
const addShakeStyle = () => {
  const styleElement = document.createElement("style");
  styleElement.innerHTML = shakeStyle;
  document.head.appendChild(styleElement);
};

const Modal = ({
  isOpen,
  onClose,
  categories = [],
  locations = [],
  onAddAsset,
}) => {
  const [assetName, setAssetName] = useState("");
  const [assetDetails, setAssetDetails] = useState("");
  const [cost, setCost] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [totalCost, setTotalCost] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [createdDate, setCreatedDate] = useState(moment());
  const [image, setImage] = useState(null);
  const [type, setType] = useState("");
  const [shakeFields, setShakeFields] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setAssetName("");
      setAssetDetails("");
      setCost("");
      setQuantity(1);
      setTotalCost("");
      setSelectedCategory("");
      setSelectedLocation("");
      setCreatedDate(moment());
      setImage(null);
      setType("");
    }
  }, [isOpen]);

  useEffect(() => {
    addShakeStyle();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const validateFields = () => {
    const newShakeFields = [];
    if (!assetName) newShakeFields.push("assetName");
    if (!assetDetails) newShakeFields.push("assetDetails");
    if (!selectedCategory) newShakeFields.push("selectedCategory");
    if (!selectedLocation) newShakeFields.push("selectedLocation");
    if (!cost) newShakeFields.push("cost");
    if (!quantity) newShakeFields.push("quantity");
    if (!type) newShakeFields.push("type");
    setShakeFields(newShakeFields);
    return newShakeFields.length === 0;
  };

  const calculateTotalCost = (newQuantity) => {
    if (cost && newQuantity) {
      const calculatedTotalCost = parseFloat(cost) * newQuantity;
      setTotalCost(calculatedTotalCost.toFixed(2));
    } else {
      setTotalCost("");
    }
  };

  const handleQuantityChange = (e) => {
    const newQuantity = Number(e.target.value);
    setQuantity(newQuantity);
    calculateTotalCost(newQuantity);
  };

  const handleCostChange = (e) => {
    const newCost = e.target.value.replace(/[^0-9.]/g, "");
    setCost(newCost);
    calculateTotalCost(quantity);
  };

  const handleSaveAsset = async () => {
    if (!validateFields()) {
      return;
    }

    const newAsset = {
      assetName,
      assetDetails,
      quantity: parseInt(quantity),
      cost: parseFloat(cost),
      totalCost: parseFloat(totalCost),
      category: selectedCategory,
      location: selectedLocation,
      createdDate: createdDate.format('YYYY-MM-DD'),
      image,
      type
    };

    console.log(newAsset);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/Assets/create`, newAsset);
      onAddAsset(response.data);
      onClose();
    } catch (error) {
      console.error("Error creating asset:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Add Asset</h2>
        </div>
        <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <form className="space-y-4">
            <InputField
              label="Asset Name"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              shake={shakeFields.includes("assetName")}
            />
            <InputField
              label="Asset Details"
              value={assetDetails}
              onChange={(e) => setAssetDetails(e.target.value)}
              shake={shakeFields.includes("assetDetails")}
            />
            <SelectField
              label="Asset Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={categories}
              shake={shakeFields.includes("selectedCategory")}
            />
            <SelectField
              label="Asset Location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              options={locations}
              shake={shakeFields.includes("selectedLocation")}
            />
            <SelectField
              label="Asset Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={['Consumable', 'Non-Consumable']}
              shake={shakeFields.includes("type")}
            />
            <InputField
              label="Cost per Unit"
              value={cost}
              onChange={handleCostChange}
              prefix="₱"
              shake={shakeFields.includes("cost")}
            />
            <InputField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              shake={shakeFields.includes("quantity")}
            />
            <InputField
              label="Total Cost"
              value={totalCost}
              prefix="₱"
              readOnly
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload Image</label>
              <input 
                type="file" 
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {image && (
                <div className="mt-2">
                  <img
                    src={image}
                    alt="Uploaded Asset"
                    className="h-20 w-20 object-cover rounded"
                  />
                </div>
              )}
            </div>
          </form>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <Button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveAsset}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Add Asset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
