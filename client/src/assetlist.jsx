import React, { useState, useCallback, useMemo } from 'react';
import './assetlist.css';
import AssetSearchbar from "./components/assetlists/assetsearchbar";
import AssetTable from "./components/assetlists/assettable";
import InfoCards from "./components/assetlists/infocards";
import AddAsset from "./components/assetlists/addasset";
import AssetCategory from "./components/assetlists/addcategory";
import AssetLocation from "./components/assetlists/addlocation";
import SortDropdown from "./components/assetlists/sortdropdown";

const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeAssetIDs, setActiveAssetIDs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCriteria, setSortCriteria] = useState("");
  const [, setSelectedAsset] = useState(null);

  // Function to generate the next asset ID
  const getNextAssetID = useCallback(() => {
    const maxID = assets.reduce((max, asset) => {
      const match = asset.assetID.match(/^OSA-ASSET-(\d+)$/);
      return match ? Math.max(max, parseInt(match[1], 10)) : max;
    }, 0);
    return `OSA-ASSET-${maxID + 1}`;
  }, [assets]);

  const handleAddAsset = useCallback((newAsset) => {
    setAssets(prevAssets => [
      ...prevAssets,
      { ...newAsset, assetID: getNextAssetID() } // Generate the next sequential ID
    ]);
    setIsModalOpen(false);
  }, [getNextAssetID]);

  const handleDeleteAsset = useCallback((id) => {
    setAssets(prevAssets => prevAssets.filter(asset => asset.assetID !== id));
    setActiveAssetIDs(prevActiveIDs => prevActiveIDs.filter(assetID => assetID !== id));
  }, []);

  const handleAddCategory = useCallback((newCategory) => {
    setCategories(prev => [...prev, newCategory]);
  }, []);

  const handleDeleteCategory = useCallback((categoryToDelete) => {
    setCategories(prevCategories => prevCategories.filter(category => category !== categoryToDelete));
    setAssets(prevAssets => prevAssets.map(asset => {
      if (asset.selectedCategory === categoryToDelete) {
        return { ...asset, selectedCategory: "" };
      }
      return asset;
    }));
  }, []);

  const handleAddLocation = useCallback((newLocation) => {
    setLocations(prev => [...prev, newLocation]);
  }, []);

  const handleDeleteLocation = useCallback((locationToDelete) => {
    setLocations(prevLocations => prevLocations.filter(location => location !== locationToDelete));
    setAssets(prevAssets => prevAssets.map(asset => {
      if (asset.selectedLocation === locationToDelete) {
        return { ...asset, selectedLocation: "" };
      }
      return asset;
    }));
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleSearch = useCallback((query) => setSearchQuery(query), []);
  const handleSort = useCallback((criteria) => setSortCriteria(criteria), []);
  const handleAllocate = useCallback((id, allocation) => {
    setAssets(prevAssets => prevAssets.map(asset =>
      asset.assetID === id
        ? { ...asset, quantity: Math.max(asset.quantity - allocation, 0) }
        : asset
    ));
  }, []);

  const handleViewAssetDetails = useCallback((asset) => {
    setSelectedAsset(asset);
  }, []);

  const filteredAndSortedAssets = useMemo(() => {
    return assets
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
  }, [assets, searchQuery, sortCriteria, activeAssetIDs]);

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

      {/* Wrap the buttons in a flex container */}
      <div className="flex space-x-4 mb-4">
        <AssetCategory 
          onSaveCategory={handleAddCategory} 
          onDeleteCategory={handleDeleteCategory}
          categories={categories}
        />
        <AssetLocation 
          onSaveLocation={handleAddLocation} 
          onDeleteLocation={handleDeleteLocation}
          locations={locations}
        />
        <AddAsset
          onAddAsset={handleAddAsset}
          categories={categories}
          locations={locations}
          isModalOpen={isModalOpen}
          onCloseModal={handleCloseModal}
          onOpenModal={handleOpenModal}
        />
      </div>

      <AssetTable
        assets={filteredAndSortedAssets}
        onDeleteAsset={handleDeleteAsset}
        onAllocateAsset={handleAllocate}
        activeAssetIDs={activeAssetIDs}
        setActiveAssetIDs={setActiveAssetIDs}
        onViewAssetDetails={handleViewAssetDetails}
      />
    </div>
  );
};

export default AssetList;
