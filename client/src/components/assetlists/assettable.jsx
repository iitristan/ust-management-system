import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import AssetDetailsModal from "./assetdetailsmodal";

const AssetTable = ({
	assets,
	onDeleteAsset,
	activeAssetIDs,
	setActiveAssetIDs,
	onAllocateAsset,
	onViewAssetDetails,
}) => {
	const [selectedImage, setSelectedImage] = useState(null);
	const [allocateData, setAllocateData] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedAsset, setSelectedAsset] = useState(null);

	const itemsPerPage = 10;
	const totalPages = Math.ceil(assets.length / itemsPerPage);

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
						<tr key={asset.assetID}>
							<td>{asset.assetID}</td>
							<td>{asset.createdDate}</td>
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
								<button
									className="asset-action-btn text-black-600 flex items-center space-x-1"
									onClick={() => onDeleteAsset(asset.assetID)}
								>
									<FontAwesomeIcon icon={faTrash} />
								</button>
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
		</div>
	);
};

export default AssetTable;
