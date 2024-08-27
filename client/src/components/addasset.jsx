import React, { useState, useCallback, useEffect } from "react";

// InputField component
const InputField = ({
	label,
	value,
	onChange,
	type = "text",
	readOnly = false,
	prefix,
	className,
	shake,
}) => (
	<div className="mb-4 relative">
		<label className="block text-sm font-medium mb-2">{label}</label>
		<input
			type={type}
			value={value}
			onChange={onChange}
			readOnly={readOnly}
			className={`border p-2 rounded w-full ${
				prefix ? "pl-8" : ""
			} ${className} ${shake ? "border-red-500 shake" : ""}`}
			placeholder={prefix ? "" : label}
		/>
		{prefix && (
			<span className="absolute left-2 top-1/2 transform -translate-y-2/2 text-black-500">
				{prefix}
			</span>
		)}
	</div>
);

// SelectField component
const SelectField = ({
	label,
	value,
	onChange,
	options = [],
	className,
	shake,
}) => {
	const safeOptions = Array.isArray(options) ? options : [];

	return (
		<div className="mb-4">
			<label className="block text-sm font-medium mb-2">{label}</label>
			<select
				value={value}
				onChange={onChange}
				className={`border p-2 rounded w-full ${className} ${
					shake ? "border-red-500 shake" : ""
				}`}
			>
				<option value="">Select {label}</option>
				{safeOptions.map((option, index) => (
					<option key={index} value={option}>
						{option}
					</option>
				))}
			</select>
		</div>
	);
};

// Button component
const Button = ({ className, onClick, children }) => (
	<button className={`px-4 py-2 rounded-lg ${className}`} onClick={onClick}>
		{children}
	</button>
);

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
	assetID,
	categories = [],
	locations = [],
	onAddAsset,
	assetToEdit,
}) => {
	const [assetName, setAssetName] = useState("");
	const [assetDetails, setAssetDetails] = useState("");
	const [quantity, setQuantity] = useState(1);
	const [cost, setCost] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedLocation, setSelectedLocation] = useState("");
	const [createdDate, setCreatedDate] = useState(new Date());
	const [image, setImage] = useState(null);
	const [shakeFields, setShakeFields] = useState([]);

	useEffect(() => {
		if (assetToEdit) {
			setAssetName(assetToEdit.assetName);
			setAssetDetails(assetToEdit.assetDetails);
			setQuantity(assetToEdit.quantity);
			setCost(assetToEdit.cost);
			setSelectedCategory(assetToEdit.selectedCategory);
			setSelectedLocation(assetToEdit.selectedLocation);
			setCreatedDate(assetToEdit.createdDate);
			setImage(assetToEdit.image || null);
		} else if (isOpen) {
			setAssetName("");
			setAssetDetails("");
			setQuantity(1);
			setCost("");
			setSelectedCategory("");
			setSelectedLocation("");
			setCreatedDate(new Date());
			setImage(null);
		}
	}, [assetToEdit, isOpen]);

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
		setShakeFields(newShakeFields);
		return newShakeFields.length === 0;
	};

	const handleSaveAsset = () => {
		if (!validateFields()) {
			return;
		}

		const updatedAsset = {
			assetID: assetToEdit ? assetToEdit.assetID : assetID,
			createdDate: formatDate(createdDate),
			assetName,
			assetDetails,
			selectedCategory,
			selectedLocation,
			quantity,
			cost,
			image,
		};
		onAddAsset(updatedAsset);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
			<div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
				<h2 className="text-lg font-semibold mb-4">
					{assetToEdit ? "Edit Asset" : "Add Asset"}
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
					options={categories.map((cat) => cat.category)}
					shake={shakeFields.includes("selectedCategory")}
				/>
				<SelectField
					label="Asset Location"
					value={selectedLocation}
					onChange={(e) => setSelectedLocation(e.target.value)}
					options={locations}
					shake={shakeFields.includes("selectedLocation")}
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

				{/* Image Upload Field */}
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
						{assetToEdit ? "Save Changes" : "Add Asset"}
					</Button>
				</div>
			</div>
		</div>
	);
};

// AddAsset component
const AddAsset = ({
	assetID,
	onAddAsset,
	categories = [],
	locations = [],
	assetToEdit,
}) => {
	const [isModalOpen, setIsModalOpen] = useState(!!assetToEdit);

	const handleOpenModal = useCallback(() => {
		setIsModalOpen(true);
	}, []);

	const handleCloseModal = useCallback(() => {
		setIsModalOpen(false);
	}, []);

	// Ensure modal is opened when `assetToEdit` changes
	useEffect(() => {
		if (assetToEdit) {
			setIsModalOpen(true);
		}
	}, [assetToEdit]);

	return (
		<div>
			<Button
				className="bg-[#68C231] text-[#343B3F] text-[10px] font-semibold"
				onClick={handleOpenModal}
			>
				{assetToEdit ? "Edit Asset" : "Add Asset"}
			</Button>
			<Modal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				assetID={assetID}
				categories={categories}
				locations={locations}
				onAddAsset={onAddAsset}
				assetToEdit={assetToEdit}
			/>
		</div>
	);
};

export default AddAsset;
