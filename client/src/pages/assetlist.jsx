import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './assetlist.css';
import AssetSearchbar from "../components/assetlists/assetsearchbar";
import AssetTable from "../components/assetlists/assettable";
import InfoCards from "../components/assetlists/infocards";
import AddAsset from "../components/assetlists/addasset";
import AssetCategory from "../components/assetlists/addcategory";
import AssetLocation from "../components/assetlists/addlocation";
import SortDropdown from "../components/assetlists/sortdropdown";
import axios from 'axios';
import Modal from "../components/assetlists/modal";

const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCriteria, setSortCriteria] = useState("");
  const [assetsForBorrowing, setAssetsForBorrowing] = useState(0);
  const [notification, setNotification] = useState(null);

  const checkServerConnection = async () => {
    try {
      const response = await axios.get('http://localhost:5000/test');
      console.log('Server connection test:', response.data);
    } catch (error) {
      console.error('Server connection test failed:', error.message);
    }
  };

  useEffect(() => {
    checkServerConnection();
    fetchAssets();
    fetchCategories();
    fetchLocations();
    fetchTotalActiveAssets();
  }, []);

  useEffect(() => {
    const fetchSortedAssets = async () => {
      if (sortCriteria === 'activeFirst' || sortCriteria === 'inactiveFirst') {
        try {
          const response = await axios.get(`http://localhost:5000/api/assets/sorted?sortOrder=${sortCriteria}`);
          setAssets(response.data);
        } catch (error) {
          console.error("Error fetching sorted assets:", error);
        }
      }
    };

    fetchSortedAssets();
  }, [sortCriteria]);

  const fetchAssets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/Assets/read');
      setAssets(response.data);
    } catch (error) {
      console.error("Error fetching assets:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      } else if (error.request) {
        console.error("No response received:", error.request);
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data.map(cat => cat.category_name));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/locations');
      setLocations(response.data.map(loc => loc.location_name));
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const fetchTotalActiveAssets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/assets/active/count');
      setAssetsForBorrowing(response.data.count);
    } catch (error) {
      console.error("Error fetching total active assets:", error);
      setAssetsForBorrowing(0);
    }
  };

  const handleAddAsset = useCallback(async (newAsset) => {
    try {
      setAssets(prevAssets => [...prevAssets, newAsset]);
      setIsModalOpen(false);
      showNotification('Asset added successfully');
    } catch (error) {
      console.error("Error adding asset:", error);
      showNotification('Error adding asset', 'error');
    }
  }, []);

  const handleDeleteAsset = useCallback(async (assetId) => {
    try {
      if (!assetId) {
        return;
      }
      const response = await axios.delete(`http://localhost:5000/api/Assets/${assetId}`);
      if (response.status === 200) {
        setAssets(prevAssets => prevAssets.filter(asset => asset.asset_id !== assetId));
        showNotification('Asset deleted successfully');
      } else {
        throw new Error('Failed to delete asset');
      }
    } catch (error) {
      showNotification('Error deleting asset', 'error');
    }
  }, []);

  const handleAddCategory = useCallback(async (newCategory) => {
    setCategories(prev => [...prev, newCategory]);
    showNotification('Category added successfully');
  }, []);

  const handleDeleteCategory = useCallback(async (categoryToDelete) => {
    setCategories(prevCategories => prevCategories.filter(category => category !== categoryToDelete));
    showNotification('Category deleted successfully');
    setAssets(prevAssets => prevAssets.map(asset => {
      if (asset.selectedCategory === categoryToDelete) {
        return { ...asset, selectedCategory: "" };
      }
      return asset;
    }));
  }, []);

  const handleAddLocation = useCallback(async (newLocation) => {
    setLocations(prev => [...prev, newLocation]);
    showNotification('Location added successfully');
  }, []);

  const handleDeleteLocation = useCallback(async (locationToDelete) => {
    setLocations(prevLocations => prevLocations.filter(location => location !== locationToDelete));
    showNotification('Location deleted successfully');
    setAssets(prevAssets => prevAssets.map(asset => {
    
      if (asset.selectedLocation === locationToDelete) {
        return { ...asset, selectedLocation: "" };
      }
      return asset;
    }));
  }, []);

  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);
  const handleSearch = useCallback((query) => setSearchQuery(query), []);
  const handleSort = useCallback((criteria) => setSortCriteria(criteria), []);

  const handleBorrowingChange = useCallback((newCount) => {
    setAssetsForBorrowing(newCount);
  }, []);

  const handleEditAsset = useCallback((editedAsset, previousAsset) => {
    setAssets(prevAssets => prevAssets.map(asset => 
      asset.asset_id === editedAsset.asset_id ? editedAsset : asset
    ));

    // Update assetsForBorrowing if the active status has changed
    if (editedAsset.is_active !== previousAsset.is_active) {
      handleBorrowingChange(previousAsset, editedAsset.is_active);
    }
  }, [handleBorrowingChange]);

  const updateAssetQuantity = useCallback(async (assetId, newQuantity) => {
    try {
      await axios.put(`http://localhost:5000/api/Assets/updateQuantity/${assetId}`, {
        quantity: newQuantity
      });
      setAssets(prevAssets => prevAssets.map(asset => 
        asset.asset_id === assetId ? { ...asset, quantity: newQuantity } : asset
      ));
      showNotification('Asset quantity updated successfully');
    } catch (error) {
      console.error("Error updating asset quantity:", error);
      showNotification('Error updating asset quantity', 'error');
    }
  }, []);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:5000/api/assets/sse');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'assetQuantityUpdate') {
        setAssets(prevAssets => prevAssets.map(asset => 
          asset.asset_id === data.assetId ? { ...asset, quantity: data.newQuantity } : asset
        ));
      }
    };

    return () => {
      eventSource.close();
    };
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
          case "nameAsc":
            return a.assetName.localeCompare(b.assetName);
          case "nameDesc":
            return b.assetName.localeCompare(a.assetName);
          case "activeFirst":
            return (b.is_active ? 1 : 0) - (a.is_active ? 1 : 0);
          case "inactiveFirst":
            return (a.is_active ? 1 : 0) - (b.is_active ? 1 : 0);
          default:
            return 0;
        }
      });
  }, [assets, searchQuery, sortCriteria]);

  const totalAssets = filteredAndSortedAssets.length;
  const totalCost = filteredAndSortedAssets.reduce((acc, asset) => acc + parseFloat(asset.cost || 0), 0);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Hide after 3 seconds
  };

  return (
    <div className="asset-list-container">
      <InfoCards 
        totalAssets={totalAssets} 
        totalCost={`₱${totalCost.toFixed(2)}`}
        assetsForBorrowing={assetsForBorrowing}
      />
      
      {/* Add this new div to contain the search bar and sort dropdown */}
      <div className="flex justify-between items-center mb-4">
        <AssetSearchbar handleSearch={handleSearch} />
        <SortDropdown onSort={handleSort} />
      </div>

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

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        categories={categories}
        locations={locations}
        onAddAsset={handleAddAsset}
      />

      <AssetTable
        assets={filteredAndSortedAssets}
        setAssets={setAssets}
        categories={categories}
        locations={locations}
        onDeleteAsset={handleDeleteAsset}
        onEditAsset={handleEditAsset}
        onBorrowingChange={handleBorrowingChange}
        updateAssetQuantity={updateAssetQuantity}
      />
      
      {notification && (
        <div className="fixed bottom-4 right-4 z-50">
          <div role="alert" className="rounded-xl border border-gray-100 bg-white p-4 shadow-lg max-w-sm">
            <div className="flex items-start gap-4">
              <span className={notification.type === 'success' ? 'text-green-600' : 'text-red-600'}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={notification.type === 'success' 
                      ? "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      : "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"}
                  />
                </svg>
              </span>

              <div className="flex-1">
                <strong className="block font-medium text-gray-900">
                  {notification.type === 'success' ? 'Success' : 'Error'}
                </strong>
                <p className="mt-1 text-sm text-gray-700">{notification.message}</p>
              </div>

              <button className="text-gray-500 transition hover:text-gray-600" onClick={() => setNotification(null)}>
                <span className="sr-only">Dismiss popup</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetList;