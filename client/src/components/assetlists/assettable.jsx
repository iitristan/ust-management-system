import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faEye, faColumns} from "@fortawesome/free-solid-svg-icons";
import AssetDetailsModal from "./assetdetailsmodal";
import EditAssetModal from "./editassetmodal";
import axios from "axios";
import moment from 'moment';
import { CSVLink } from "react-csv";
import ConfirmationModal from './deleteconfirmationmodal';
import QuantityForBorrowingModal from './quantityforborrowing';

const ColumnVisibilityPopup = ({ visibleColumns, toggleColumnVisibility, onClose }) => {
	return (
		<div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
			<h3 className="text-lg font-semibold mb-2">Toggle Columns</h3>
			<div className="space-y-2">
				{Object.entries(visibleColumns).map(([columnName, isVisible]) => (
					<div key={columnName} className="flex items-center">
						<input
							type="checkbox"
							id={columnName}
							checked={isVisible}
							onChange={() => toggleColumnVisibility(columnName)}
							className="mr-2"
						/>
						<label htmlFor={columnName} className="cursor-pointer">
							{columnName.replace(/([A-Z])/g, ' $1').trim()}
						</label>
					</div>
				))}
			</div>
			<button
				onClick={onClose}
				className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
			>
				Close
			</button>
		</div>
	);
};

const AssetTable = ({
	assets,
	setAssets,
	categories,
	locations,
	onDeleteAsset,
	onEditAsset,
	onBorrowingChange,
	onQuantityForBorrowingChange,	
}) => {
	const [selectedImage, setSelectedImage] = useState(null);
	
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedAsset, setSelectedAsset] = useState(null);
	const [editingAsset, setEditingAsset] = useState(null);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [assetToDelete, setAssetToDelete] = useState(null);
	const [visibleColumns, setVisibleColumns] = useState({



		
		
		id: true,
		dateCreated: true,
		asset: true,
		costPerUnit: true,
		quantity: true,
		totalCost: true,
		borrow: true,
		lastUpdated: true,
		actions: true,
		quantityForBorrowing: true,
	});
	const [isColumnPopupOpen, setIsColumnPopupOpen] = useState(false);
	const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
	const [selectedAssetForBorrowing, setSelectedAssetForBorrowing] = useState(null);

	const totalPages = Math.ceil(assets.length / itemsPerPage);

	const fetchAssets = async () => {
		try {
			const response = await axios.get("http://localhost:5000/api/Assets/read");
			console.log("Fetched assets:", response.data);
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

	useEffect(() => {
		fetchAssets();
	}, []);

	const handleBorrowClick = async (assetID) => {
		const asset = assets.find(a => a.asset_id === assetID);
		if (asset.is_active) {
			// If the asset is already active, deactivate it
			try {
				const response = await axios.put(`http://localhost:5000/api/assets/${assetID}/active`, { isActive: false });
				if (response.data) {
					const updatedAssets = assets.map(a => 
						a.asset_id === assetID ? { ...a, is_active: false, quantity_for_borrowing: 0 } : a
					);
					setAssets(updatedAssets);
					const newActiveCount = updatedAssets.filter(a => a.is_active).length;
					onBorrowingChange(newActiveCount);
				}
			} catch (error) {
				console.error("Error updating asset active status:", error);
			}
		} else {
			// If the asset is inactive, open the quantity modal
			setSelectedAssetForBorrowing(asset);
			setIsQuantityModalOpen(true);
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

	const handleDeleteClick = (asset) => {
		setAssetToDelete(asset);
		setIsDeleteModalOpen(true);
	};

	const handleDeleteConfirm = async () => {
		try {
			if (!assetToDelete || !assetToDelete.asset_id) {
				console.error("Invalid asset or asset_id is undefined");
				return;
			}
			console.log("Deleting asset with ID:", assetToDelete.asset_id);
			const response = await axios.delete(`http://localhost:5000/api/assets/delete/${assetToDelete.asset_id}`);
			if (response.status === 200) {
				console.log("Asset deleted successfully");
				onDeleteAsset(assetToDelete.asset_id);
				setIsDeleteModalOpen(false);
				setAssetToDelete(null);
				fetchAssets();
			} else {
				console.error("Error deleting asset:", response.data.error);
			}
		} catch (error) {
			console.error("Error deleting asset:", error.response ? error.response.data : error.message);
		}
	};

	const prepareCSVData = () => {
		const headers = [
			"ID",
			"Date Created",
			"Asset Name",
			"Cost per Unit",
			"Quantity",
			"Total Cost",
			"Is Active",
			"Last Updated",
			"Category",
			"Location",
			"Type",
			"Details"
		];

		const csvData = assets.map(asset => [
			asset.asset_id,
			moment(asset.createdDate).format('MM/DD/YYYY'),
			asset.assetName,
			parseFloat(asset.cost).toFixed(2),
			asset.quantity,
			(parseFloat(asset.cost) * asset.quantity).toFixed(2),
			asset.is_active ? "Yes" : "No",
			asset.lastUpdated ? moment(asset.lastUpdated).format('MM/DD/YYYY HH:mm:ss') : 'N/A',
			asset.category,
			asset.location,
			asset.type,
			asset.assetDetails
		]);

		return [headers, ...csvData];
	};

	const toggleColumnVisibility = (columnName) => {
		setVisibleColumns(prev => ({
			...prev,
			[columnName]: !prev[columnName]
		}));
	};

	const handleQuantityConfirm = async (quantity) => {
		console.log('Before update - selectedAssetForBorrowing:', selectedAssetForBorrowing);
		try {
			const response = await axios.put(`http://localhost:5000/api/assets/${selectedAssetForBorrowing.asset_id}/active`, { 
				isActive: true,
				quantityForBorrowing: quantity
			});
			console.log('Update active status response:', response.data);
			console.log('After update - updatedAsset:', response.data);
			if (response.data) {
				const updatedAssets = assets.map(a => 
					a.asset_id === selectedAssetForBorrowing.asset_id 
						? { ...a, is_active: true, quantity_for_borrowing: quantity } 
						: a
				);
				setAssets(updatedAssets);
				const newActiveCount = updatedAssets.filter(a => a.is_active).length;
				onBorrowingChange(newActiveCount);
			}
		} catch (error) {
			console.error("Error updating asset active status and quantity:", error);
		}
		setIsQuantityModalOpen(false);
		setSelectedAssetForBorrowing(null);
	};

	return (
		<div className="relative p-4 w-full bg-white border border-gray-200 rounded-lg shadow-md font-roboto text-[20px]">
			<div className="mb-4 flex justify-end relative">
				<button
					onClick={() => setIsColumnPopupOpen(!isColumnPopupOpen)}
					className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 shadow-md flex items-center justify-center"
					title="Toggle column visibility"
				>
					<FontAwesomeIcon icon={faColumns} className="text-lg" />
				</button>
				{isColumnPopupOpen && (
					<ColumnVisibilityPopup
						visibleColumns={visibleColumns}
						toggleColumnVisibility={toggleColumnVisibility}
						onClose={() => setIsColumnPopupOpen(false)}
					/>
				)}
			</div>
			<div className="overflow-x-auto">
				<table className="asset-table w-full min-w-[750px]">
					<thead>
						<tr>
							{visibleColumns.id && <th className="text-center">ID</th>}
							{visibleColumns.dateCreated && <th className="text-center">Date Created</th>}
							{visibleColumns.asset && <th className="text-center">Asset</th>}
							{visibleColumns.costPerUnit && <th className="text-center">Cost per Unit</th>}
							{visibleColumns.quantity && <th className="text-center">Quantity</th>}
							{visibleColumns.totalCost && <th className="text-center">Total Cost</th>}
							{visibleColumns.borrow && <th className="text-center">Borrow</th>}
							{visibleColumns.lastUpdated && <th className="text-center">Last Updated</th>}
							{visibleColumns.actions && <th className="text-center px-2">Actions</th>}
							{visibleColumns.quantityForBorrowing && <th className="text-center">Quantity for Borrowing</th>}
						</tr>
					</thead>
					<tbody>
						{currentAssets.map((asset) => (
							<tr key={asset.asset_id}>
								{visibleColumns.id && <td className="text-center align-middle" data-label="ID">{asset.asset_id}</td>}
								{visibleColumns.dateCreated && <td className="text-center align-middle" data-label="Date Created">{moment(asset.createdDate).format('MM/DD/YYYY')}</td>}
								{visibleColumns.asset && <td className="text-center align-middle" data-label="Asset">
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
								</td>}
								{visibleColumns.costPerUnit && <td className="text-center align-middle" data-label="Cost per Unit">₱{parseFloat(asset.cost).toFixed(2)}</td>}
								{visibleColumns.quantity && <td className="text-center align-middle" data-label="Quantity">{asset.quantity}</td>}
								{visibleColumns.totalCost && <td className="text-center align-middle" data-label="Total Cost">₱{(parseFloat(asset.cost) * asset.quantity).toFixed(2)}</td>}
								{visibleColumns.borrow && <td className="text-center align-middle" data-label="Borrow">
									<button
										className={`w-20 h-8 rounded-full font-semibold text-xs transition-all duration-300 shadow-md ${
											asset.is_active
												? "bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700"
												: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700"
										}`}
										onClick={() => handleBorrowClick(asset.asset_id)}
										aria-label={`Toggle borrow status for ${asset.assetName}`}
									>
										{asset.is_active ? "Active" : "Inactive"}
									</button>
								</td>}
								
								{visibleColumns.lastUpdated && <td className="text-center align-middle" data-label="Last Updated">
									{asset.lastUpdated ? moment(asset.lastUpdated).format('MM/DD/YYYY HH:mm:ss') : 'N/A'}
								</td>}
								{visibleColumns.actions && <td className="text-center align-middle px-2" data-label="Actions">
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
											onClick={() => handleDeleteClick(asset)}
										>
											<FontAwesomeIcon icon={faTrash} />
										</button>
									</div>
								</td>}
								{visibleColumns.quantityForBorrowing && (
									
									<td className="text-center align-middle" data-label="Quantity for Borrowing">
										   {console.log('Asset data:', asset)}
    {asset.is_active 
      ? (asset.quantity_for_borrowing !== undefined 
          ? asset.quantity_for_borrowing 
          : 'Not set')
      : 'N/A'}
									</td>
								)}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination Controls, Rows Per Page, and Print to CSV */}
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
				<CSVLink
					data={prepareCSVData()}
					filename={"asset_data.csv"}
					className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
				>
					Print to CSV
				</CSVLink>
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

			{/* Confirmation Modal */}
			<ConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={handleDeleteConfirm}
				message={`Are you sure you want to delete the asset "${assetToDelete?.assetName}"? This action cannot be undone.`}
			/>

			<QuantityForBorrowingModal
				isOpen={isQuantityModalOpen}
				onClose={() => setIsQuantityModalOpen(false)}
				onConfirm={handleQuantityConfirm}
				maxQuantity={selectedAssetForBorrowing ? selectedAssetForBorrowing.quantity : 1}
			/>
		</div>
	);
};

export default AssetTable;