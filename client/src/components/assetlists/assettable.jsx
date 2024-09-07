import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faEye, } from "@fortawesome/free-solid-svg-icons";
import AssetDetailsModal from "./assetdetailsmodal";
import EditAssetModal from "./editassetmodal";
import axios from "axios";
import moment from 'moment';

const AssetTable = ({
	assets,
	setAssets,
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
	const [itemsPerPage, setItemsPerPage] = useState(10);

	const totalPages = Math.ceil(assets.length / itemsPerPage);

	useEffect(() => {
		fetchAssets();
	}, []);

	const fetchAssets = async () => {
		try {
			const response = await axios.get("http://localhost:5000/api/Assets/read");
			const updatedAssets = response.data.map(asset => ({
				...asset,
				lastUpdated: asset.lastUpdated ? moment(asset.lastUpdated) : null
			}));
			setAssets(updatedAssets);
			const activeCount = updatedAssets.filter(asset => asset.is_active).length;
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

	
	const handleCloseImageModal = () => {
		setSelectedImage(null);
	};

	

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	const handleAssetDetailsClick = (asset) => {
		setSelectedAsset(asset);
	};

	const handleItemsPerPageChange = (e) => {
		const newItemsPerPage = parseInt(e.target.value, 10);
		setItemsPerPage(newItemsPerPage);
		setCurrentPage(1); // Reset to first page when changing items per page
	};

	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentAssets = assets.slice(startIndex, startIndex + itemsPerPage);

	const handleEditClick = (asset) => {
		setEditingAsset(asset);
	};

	const handleEditAsset = async (editedAsset) => {
		const previousAsset = assets.find(asset => asset.asset_id === editedAsset.asset_id);
		try {
			const response = await axios.put(`http://localhost:5000/api/Assets/update/${editedAsset.asset_id}`, editedAsset);
			const updatedAsset = response.data;
			setAssets(prevAssets => prevAssets.map(asset => 
				asset.asset_id === updatedAsset.asset_id ? updatedAsset : asset
			));
			onEditAsset(updatedAsset, previousAsset);
			setEditingAsset(null);
		} catch (error) {
			console.error("Error updating asset:", error);
		}
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

	

	return (
		<div className="relative p-4 w-full bg-white border border-gray-200 rounded-lg shadow-md font-roboto text-[20px]">
			<div className="overflow-x-auto">
				<table className="asset-table w-full min-w-[750px]">
					<thead>
						<tr>
							<th className="text-center">ID</th>
							<th className="text-center">Date Created</th>
							<th className="text-center">Asset</th>
							<th className="text-center">Cost</th>
							<th className="text-center">Quantity</th>
							<th className="text-center">Borrow</th>
							<th className="text-center">Last Updated</th>
							<th className="text-center px-2">Actions</th>
						</tr>
					</thead>
					<tbody>
						{currentAssets.map((asset) => (
							<tr key={asset.asset_id}>
								<td className="text-center align-middle" data-label="ID">{asset.asset_id}</td>
								<td className="text-center align-middle" data-label="Date Created">{moment(asset.createdDate).format('MM/DD/YYYY')}</td>
								<td className="text-center align-middle" data-label="Asset">
									<div className="inline-flex items-center justify-center">
										{asset.image && (
											<img
												src={asset.image}
												alt={asset.assetName}
												className="asset-image mr-2 h-6 w-6"
											/>
										)}
										<span>{asset.assetName}</span>
									</div>
								</td>
								<td className="text-center align-middle" data-label="Cost">₱{parseFloat(asset.cost).toFixed(2)}</td>
								<td className="text-center align-middle" data-label="Quantity">{asset.quantity}</td>
								<td className="text-center align-middle" data-label="Borrow">
									<button
										className={`borrow-button ${
											asset.is_active ? "active" : "inactive"
										} mx-auto`}
										onClick={() => handleBorrowClick(asset.asset_id)}
										aria-label={`Borrow ${asset.asset_id}`}
									></button>
								</td>
								
								<td className="text-center align-middle" data-label="Last Updated">
									{asset.lastUpdated ? moment(asset.lastUpdated).format('MM/DD/YYYY HH:mm:ss') : 'N/A'}
								</td>
								<td className="text-center align-middle px-2" data-label="Actions">
									<div className="inline-flex items-center justify-center space-x-2">
										<button
											className="asset-action-btn text-blue-600"
											onClick={() => handleAssetDetailsClick(asset)}
										>
											<FontAwesomeIcon icon={faEye} />
										</button>
										<button
											className="asset-action-btn text-blue-600"
											onClick={() => handleEditClick(asset)}
										>
											<FontAwesomeIcon icon={faEdit} />
										</button>
										<button
											className="asset-action-btn text-red-600"
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

			{/* Pagination Controls and Rows Per Page */}
			<div className="pagination-controls flex justify-between items-center mt-4">
				<div className="flex items-center">
					<span className="mr-2">Rows per page:</span>
					<select
						value={itemsPerPage}
						onChange={handleItemsPerPageChange}
						className="border border-gray-300 rounded px-2 py-1"
					>
						<option value={5}>5</option>
						<option value={10}>10</option>
						<option value={20}>20</option>
						<option value={50}>50</option>
					</select>
				</div>
				<div className="flex items-center">
					<button
						className="pagination-button mr-2"
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
					>
						Previous
					</button>
					<span className="text-xl mx-2">
						Page {currentPage} of {totalPages}
					</span>
					<button
						className="pagination-button ml-2"
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
					>
						Next
					</button>
				</div>
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
