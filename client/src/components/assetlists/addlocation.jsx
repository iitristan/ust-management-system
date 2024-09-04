import React, { useState, useCallback, useEffect } from "react";
import Button from './button';
import axios from 'axios';

// Modal Component
const Modal = ({
	isOpen,
	onClose,
	onSaveLocation,
	locations = [],
	onDeleteLocation,
}) => {
	const [location, setLocation] = useState("");

	const handleSaveLocation = async () => {
		if (location.trim()) {
			try {
				const response = await axios.post('http://localhost:5000/api/locations', { locationName: location });
				onSaveLocation(response.data.location_name);
				setLocation("");
				onClose();
			} catch (error) {
				console.error("Error adding location:", error);
			}
		}
	};

	const handleDeleteLocation = async (loc) => {
		try {
			await axios.delete(`http://localhost:5000/api/locations/${encodeURIComponent(loc)}`);
			onDeleteLocation(loc);
		} catch (error) {
			console.error("Error deleting location:", error);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
			<div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
				<h2 className="text-lg font-semibold mb-4">Location Name</h2>
				<input
					type="text"
					value={location}
					onChange={(e) => setLocation(e.target.value)}
					className="border p-2 rounded w-full mb-4"
					placeholder="Enter location name"
				/>
				<h3 className="text-md font-semibold mb-2">Existing Locations</h3>
				<ul className="mb-4">
					{locations.map((loc, index) => (
						<li key={index} className="flex justify-between items-center mb-2">
							<span>{loc}</span>
							<Button
								className="bg-red-500 text-white"
								onClick={() => handleDeleteLocation(loc)}
							>
								Delete
							</Button>
						</li>
					))}
				</ul>
				<div className="flex justify-end gap-4">
					<Button className="bg-gray-300" onClick={onClose}>
						Cancel
					</Button>
					<Button
						className="bg-green-500 text-white"
						onClick={handleSaveLocation}
					>
						Save Location
					</Button>
				</div>
			</div>
		</div>
	);
};

const AssetLocation = ({ onSaveLocation, onDeleteLocation, locations }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
	const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

	return (
		<div className="group-button">
			<Button
				className="bg-[#ffff00] text-[#343B3F] text-[10px] font-semibold"
				onClick={handleOpenModal}
			>
				Add Location
			</Button>

			<Modal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				onSaveLocation={onSaveLocation}
				locations={locations}
				onDeleteLocation={onDeleteLocation}
			/>
		</div>
	);
};

export default AssetLocation;
