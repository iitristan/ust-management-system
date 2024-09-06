import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import AssetDetailsModal from "./assetdetailsmodal";
import EditAssetModal from "./editassetmodal";
import axios from "axios";
import moment from 'moment';

const AssetTable = ({
	assets,
	setAssets,
	activeAssetIDs,
	setActiveAssetIDs,
	onAllocateAsset,
	categories,
	locations,
	onDeleteAsset, // Make sure this prop is passed from the parent component
}) => {
	const [selectedImage, setSelectedImage] = useState(null);
	const [allocateData, setAllocateData] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedAsset, setSelectedAsset] = useState(null);
	const [editingAsset, setEditingAsset] = useState(null);

	const itemsPerPage = 10;
	const totalPages = Math.ceil(assets.length / itemsPerPage);

	useEffect(() => {
		fetchAssets();
	}, []);

	const fetchAssets = async () => {
		try {
			const response = await axios.get("http://localhost:5000/api/Assets/read");
			setAssets(response.data);
		} catch (error) {
			console.error("Error fetching assets:", error);
		}
	};

	const handleBorrowClick = (assetID) => {
		setActiveAssetIDs((prevIDs) => {
			if (prevIDs.includes(assetID)) {
				return prevIDs.filter((id) => id !== assetID);
			} else {
				return [...prevIDs, assetID];
			}
		});
	};

	const handleImageClick = (image) => {
		setSelectedImage(image);
	};

	const handleCloseImageModal = () => {
		setSelectedImage(null);
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

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	const handleAssetNameClick = (asset) => {
		setSelectedAsset(asset);
	};

	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentAssets = assets.slice(startIndex, startIndex + itemsPerPage);

	const handleEditClick = (asset) => {
		setEditingAsset(asset);
	};

	const handleEditAsset = async (editedAsset) => {
		try {
			const response = await axios.put(
				`http://localhost:5000/api/Assets/update/${editedAsset.assetID}`,
				editedAsset
			);
			setAssets(
				assets.map((asset) =>
					asset.assetID === editedAsset.assetID ? response.data : asset
				)
			);
			setEditingAsset(null);
		} catch (error) {
			console.error("Error updating asset:", error);
		}
	};

	const handleDeleteAsset = async (asset) => {
		try {
			console.log("Attempting to delete asset:", asset); // Log the entire asset object
			if (!asset || !asset.asset_id) {
				console.error("Invalid asset or asset_id is undefined");
				return;
			}
			console.log("Deleting asset with ID:", asset.asset_id);
			await onDeleteAsset(asset.asset_id);
			console.log("Asset deleted successfully");
		} catch (error) {
			console.error("Error deleting asset:", error);
		}
	};

	return (
		<div className="relative p-4 w-full bg-white border border-gray-200 rounded-lg shadow-md font-roboto text-[20px]">
			<table className="asset-table">
				<thead>
					<tr>
						<th>ID</th>
						<th>Date Created</th>
						<th>Asset</th>
						<th>Quantity</th>
						<th>Borrow</th>
						<th>Allocate</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{currentAssets.map((asset) => (
						<tr key={asset.asset_id}>
							<td>{asset.asset_id}</td> {/* Display the asset_id */}
							<td>{moment(asset.createdDate).format('MM/DD/YYYY')}</td>
							<td>
								<div className="flex items-center justify-center">
									{asset.image && (
										<img
											src={asset.image}
											alt={asset.assetName}
											className="asset-image"
											onClick={() => handleImageClick(asset.image)}
										/>
									)}
									<span
										className="text-blue-600 cursor-pointer"
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
										className={`borrow-button ${
											activeAssetIDs.includes(asset.assetID)
												? "active"
												: "inactive"
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
													handleAllocateChange(
														asset.assetID,
														parseInt(e.target.value, 10)
													)
												}
											/>
											<button
												className="ml-2 asset-action-btn"
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
										/>
									)}
								</div>
							</td>
							<td>
								<div className="flex items-center space-x-2">
									<button
										className="asset-action-btn text-blue-600 flex items-center space-x-1"
										onClick={() => handleEditClick(asset)}
									>
										<FontAwesomeIcon icon={faEdit} />
									</button>
									<button
										className="asset-action-btn text-red-600 flex items-center space-x-1"
										onClick={() => handleDeleteAsset(asset)}
									>
										<FontAwesomeIcon icon={faTrash} />
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* Pagination Controls */}
			<div className="pagination-controls">
				<button
					className="pagination-button"
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1}
				>
					Previous
				</button>
				<span className="text-xl">
					Page {currentPage} of {totalPages}
				</span>
				<button
					className="pagination-button"
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					Next
				</button>
			</div>

			{/* Modal for enlarged image */}
			{selectedImage && (
				<div className="modal-overlay">
					<div className="modal-content">
						<img
							src={selectedImage}
							alt="Enlarged Asset"
							className="h-96 w-96 object-cover"
						/>
						<button className="modal-close-btn" onClick={handleCloseImageModal}>
							&times;
						</button>
					</div>
				</div>
			)}

			{/* Asset Details Modal */}
			{selectedAsset && (
				<AssetDetailsModal
					selectedAsset={selectedAsset}
					onClose={() => setSelectedAsset(null)}
				/>
			)}

			{/* Edit Asset Modal */}
			<EditAssetModal
				isOpen={editingAsset !== null}
				onClose={() => setEditingAsset(null)}
				asset={editingAsset} // This should be the full asset object, not just the ID
				categories={categories}
				locations={locations}
				onEditAsset={handleEditAsset}
			/>
		</div>
	);
};

export default AssetTable;
