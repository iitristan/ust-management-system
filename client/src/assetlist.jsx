import React, { useState, useCallback } from 'react';
import './assetlist.css';
import AssetSearchbar from "./components/assetsearchbar";
import AssetTable from "./components/assettable";
import InfoCards from "./components/infocards";
import AddAsset from "./components/addasset";
import AssetCategory from "./components/addcategory";
import AssetLocation from "./components/assetlocation";
import SortDropdown from "./components/sortdropdown";

const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [assetID, setAssetID] = useState(1);
  const [assetToEdit, setAssetToEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeAssetIDs, setActiveAssetIDs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCriteria, setSortCriteria] = useState("");

  const handleAddAsset = useCallback((newAsset) => {
    setAssets((prevAssets) => {
      if (assetToEdit) {
        return prevAssets.map(asset => asset.assetID === newAsset.assetID ? newAsset : asset);
      } else {
        setAssetID((prevID) => prevID + 1);
        return [...prevAssets, { ...newAsset, assetID }];
      }
    });
    setAssetToEdit(null);
    setIsModalOpen(false);
  }, [assetToEdit, assetID]);

  const handleDeleteAsset = useCallback((id) => {
    setAssets((prevAssets) => {
      const updatedAssets = prevAssets.filter(asset => asset.assetID !== id);
      setActiveAssetIDs((prevActiveIDs) => prevActiveIDs.filter(assetID => assetID !== id));
      return updatedAssets;
    });
  }, []);

  const handleAddCategory = useCallback((newCategoryData) => {
    setCategories((prev) => [...prev, newCategoryData]);
  }, []);

  const handleAddLocation = useCallback((newLocation) => {
    setLocations((prev) => [...prev, newLocation]);
  }, []);

  const handleEditAsset = (asset) => {
    setAssetToEdit(asset);
    setIsModalOpen(true);
  };

  const handleOpenModal = () => {
    setAssetToEdit(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAssetToEdit(null);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSort = (criteria) => {
    setSortCriteria(criteria);
  };

  const handleAllocate = useCallback((id, allocation) => {
    setAssets((prevAssets) =>
      prevAssets.map((asset) =>
        asset.assetID === id
          ? {
              ...asset,
              quantity: asset.quantity - allocation >= 0 ? asset.quantity - allocation : 0,
            }
          : asset
      )
    );
  }, []);

  // Filter and sort assets based on search query and sort criteria
  const filteredAndSortedAssets = assets
    .filter(asset => asset.assetName.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortCriteria) {
        case "dateAsc":
          return new Date(a.createdDate) - new Date(b.createdDate);
        case "dateDesc":
          return new Date(b.createdDate) - new Date(a.createdDate);
        case "quantityAsc":
          return a.quantity - b.quantity;
        case "quantityDesc":
          return b.quantity - a.quantity;
        case "borrowActive":
          return activeAssetIDs.includes(a.assetID) ? -1 : 1;
        case "borrowInactive":
          return activeAssetIDs.includes(a.assetID) ? 1 : -1;
        case "nameAsc":
          return a.assetName.localeCompare(b.assetName);
        case "nameDesc":
          return b.assetName.localeCompare(a.assetName);
        default:
          return 0;
      }
    });

  const totalAssets = filteredAndSortedAssets.length;
  const totalCost = filteredAndSortedAssets.reduce((acc, asset) => acc + parseFloat(asset.cost || 0), 0);
  const assetsForBorrowing = activeAssetIDs.length;

  return (
    <div className="asset-list-container">
      <InfoCards 
        totalAssets={totalAssets} 
        totalCost={`₱${totalCost.toFixed(2)}`} 
        assetsForBorrowing={assetsForBorrowing} 
      />
      <AssetSearchbar handleSearch={handleSearch} />
      <SortDropdown onSort={handleSort} />
      <AddAsset
        assetID={assetID}
        onAddAsset={handleAddAsset}
        categories={categories}
        locations={locations}
        assetToEdit={assetToEdit}
        isModalOpen={isModalOpen}
        onCloseModal={handleCloseModal}
        onOpenModal={handleOpenModal}
      />
      <AssetTable
        assets={filteredAndSortedAssets}
        onDeleteAsset={handleDeleteAsset}
        onEditAsset={handleEditAsset}
        onAllocateAsset={handleAllocate} // Fixed prop name
        activeAssetIDs={activeAssetIDs}
        setActiveAssetIDs={setActiveAssetIDs}
      />
      <AssetCategory onSaveCategory={handleAddCategory} />
      <AssetLocation onSaveLocation={handleAddLocation} />
    </div>
  );
};

export default AssetList;
