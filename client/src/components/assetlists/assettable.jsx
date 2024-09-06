import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import AssetDetailsModal from "./assetdetailsmodal";
import EditAssetModal from "./editassetmodal";
import axios from "axios";
import moment from 'moment';

const AssetTable = ({
	assets,
	setAssets,
	onAllocateAsset,
	categories,
	locations,
	onDeleteAsset,
	onEditAsset,
	onBorrowingChange,
}) => {
	const [selectedImage, setSelectedImage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedAsset, setSelectedAsset] = useState(null);
	const [editingAsset, setEditingAsset] = useState(null);
	const [activeAssetIDs, setActiveAssetIDs] = useState({});
	const [allocateData, setAllocateData] = useState({});

	const itemsPerPage = 10;
	const totalPages = Math.ceil(assets.length / itemsPerPage);

	useEffect(() => {
		fetchAssets();
	}, []);

	const fetchAssets = async () => {
		try {
			const response = await axios.get("http://localhost:5000/api/Assets/read");
			setAssets(response.data);
			const activeCount = response.data.filter(asset => asset.is_active).length;
			onBorrowingChange(activeCount);
		} catch (error) {
			console.error("Error fetching assets:", error);
		}
	};

	const handleBorrowClick = async (assetID) => {
		try {
			const asset = assets.find(a => a.asset_id === assetID);
			const newActiveStatus = !asset.is_active;
			const response = await axios.put(`http://localhost:5000/api/assets/${assetID}/active`, { isActive: newActiveStatus });
			if (response.data) {
				const updatedAssets = assets.map(a => 
					a.asset_id === assetID ? { ...a, is_active: newActiveStatus } : a
				);
				setAssets(updatedAssets);
				const newActiveCount = updatedAssets.filter(a => a.is_active).length;
				onBorrowingChange(newActiveCount);
			}
		} catch (error) {
			console.error("Error updating asset active status:", error);
		}
	};

	const handleImageClick = (image) => {
		setSelectedImage(image);
	};

	const handleCloseImageModal = () => {
		setSelectedImage(null);
	};

	const handleAllocateClick = (assetID) => {
		setAllocateData(prevData => ({
			...prevData,
			[assetID]: prevData[assetID] === undefined ? 0 : undefined
		}));
	};

	const handleAllocateChange = (assetID, allocation) => {
		setAllocateData(prevData => ({
			...prevData,
			[assetID]: allocation
		}));
	};

	const handleApplyAllocation = async (assetID) => {
		const allocation = allocateData[assetID];
		if (allocation >= 0) {
			try {
				const response = await axios.put(`http://localhost:5000/api/assets/${assetID}/allocate`, { allocatedQuantity: allocation });
				setAssets(prevAssets => prevAssets.map(asset => 
					asset.asset_id === assetID ? response.data : asset
				));
				onAllocateAsset(assetID, allocation);
				setAllocateData(prevData => ({
					...prevData,
					[assetID]: undefined
				}));
			} catch (error) {
				console.error("Error allocating asset:", error);
			}
		}
	};

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	const handleAssetDetailsClick = (asset) => {
		setSelectedAsset(asset);
	};

	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentAssets = assets.slice(startIndex, startIndex + itemsPerPage);

	const handleEditClick = (asset) => {
		setEditingAsset(asset);
	};

	const handleEditAsset = (editedAsset) => {
		const previousAsset = assets.find(asset => asset.asset_id === editedAsset.asset_id);
		onEditAsset(editedAsset, previousAsset);
		setEditingAsset(null);
	};

	const handleDeleteAsset = async (asset) => {
		try {
			console.log("Attempting to delete asset:", asset);
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

	const handleBorrow = (assetId, quantity) => {
		onAllocateAsset(assetId, quantity);
	};

	const handleActiveStatusChange = async (asset, newActiveStatus) => {
		try {
			const response = await axios.put(`http://localhost:5000/api/assets/${asset.asset_id}/active`, { isActive: newActiveStatus });
			if (response.data) {
				const updatedAsset = { ...asset, is_active: newActiveStatus };
				onEditAsset(updatedAsset, asset);
			}
		} catch (error) {
			console.error("Error updating asset active status:", error);
		}
	};

	return (
		<div className="relative p-4 w-full bg-white border border-gray-200 rounded-lg shadow-md font-roboto text-[20px]">
			<div className="overflow-x-auto">
				<table className="asset-table w-full min-w-[750px]">
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
								<td data-label="ID">{asset.asset_id}</td>
								<td data-label="Date Created">{moment(asset.createdDate).format('MM/DD/YYYY')}</td>
								<td data-label="Asset">
									<div className="flex items-center">
										{asset.image && (
											<img
												src={asset.image}
												alt={asset.assetName}
												className="asset-image mr-2"
											/>
										)}
										<span>{asset.assetName}</span>
									</div>
								</td>
								<td data-label="Quantity">{asset.quantity}</td>
								<td data-label="Borrow">
									<button
										className={`borrow-button ${
											asset.is_active ? "active" : "inactive"
										}`}
										onClick={() => handleBorrowClick(asset.asset_id)}
										aria-label={`Borrow ${asset.asset_id}`}
									></button>
								</td>
								<td data-label="Allocate">
									{allocateData[asset.asset_id] !== undefined ? (
										<div className="flex items-center">
											<input
												type="number"
												className="w-16 p-1 border border-gray-300 rounded"
												min="0"
												max={asset.quantity}
												value={allocateData[asset.asset_id]}
												onChange={(e) =>
													handleAllocateChange(
														asset.asset_id,
														parseInt(e.target.value, 10)
													)
												}
											/>
											<button
												className="ml-2 asset-action-btn"
												onClick={() => handleApplyAllocation(asset.asset_id)}
											>
												Apply
											</button>
										</div>
									) : (
										<FontAwesomeIcon
											icon={faPlus}
											className="text-green-500 cursor-pointer"
											onClick={() => handleAllocateClick(asset.asset_id)}
										/>
									)}
								</td>
								<td data-label="Actions">
									<div className="flex items-center space-x-2">
										<button
											className="asset-action-btn text-blue-600 flex items-center space-x-1"
											onClick={() => handleAssetDetailsClick(asset)}
										>
											<FontAwesomeIcon icon={faEye} />
										</button>
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
			</div>

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
				asset={editingAsset}
				categories={categories}
				locations={locations}
				onEditAsset={handleEditAsset}
			/>
		</div>
	);
};

export default AssetTable;
