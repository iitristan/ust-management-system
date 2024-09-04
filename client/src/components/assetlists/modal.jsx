// Modal.js
import React, { useState, useEffect } from 'react';
import InputField from './inputfield';
import SelectField from './selectfield';
import Button from './button';
import axios from 'axios';

// Format date helper function
const formatDate = (date) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
};

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
  const [quantity, setQuantity] = useState(1);
  const [cost, setCost] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [createdDate, setCreatedDate] = useState(new Date());
  const [image, setImage] = useState(null);
  const [type, setType] = useState("");
  const [shakeFields, setShakeFields] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setAssetName("");
      setAssetDetails("");
      setQuantity(1);
      setCost("");
      setSelectedCategory("");
      setSelectedLocation("");
      setCreatedDate(new Date());
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
    if (!quantity) newShakeFields.push("quantity");
    if (!cost) newShakeFields.push("cost");
    if (!type) newShakeFields.push("type");
    setShakeFields(newShakeFields);
    return newShakeFields.length === 0;
  };

  const handleSaveAsset = async () => {
    if (!validateFields()) {
      return;
    }

    const newAsset = {
      assetName,
      assetDetails,
      category: selectedCategory,
      location: selectedLocation,
      quantity: parseInt(quantity),
      cost: parseFloat(cost),
      image,
      type,
      createdDate: createdDate.toISOString() // Send as ISO string
    };

    try {
      console.log("Sending asset data:", newAsset); // Log the data being sent
      const response = await axios.post('http://localhost:5000/api/Assets/create', newAsset);
      console.log("Server response:", response.data); // Log the server response
      if (response.data) {
        onAddAsset(response.data);
        onClose();
      } else {
        console.error("No data returned from server");
      }
    } catch (error) {
      console.error("Error creating asset:", error.response ? error.response.data : error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          Add Asset
        </h2>
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
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          shake={shakeFields.includes("quantity")}
        />
        <InputField
          label="Cost"
          value={cost}
          onChange={(e) => setCost(e.target.value.replace(/[^0-9]/g, ""))}
          prefix="₱"
          shake={shakeFields.includes("cost")}
        />

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Upload Image</label>
          <input type="file" onChange={handleImageUpload} />
          {image && (
            <div className="mt-2">
              <img
                src={image}
                alt="Uploaded Asset"
                className="h-20 w-20 object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <Button className="bg-gray-300" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-green-500 text-white" onClick={handleSaveAsset}>
            Add Asset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
