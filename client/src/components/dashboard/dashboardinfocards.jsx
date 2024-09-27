import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import AssetDetailsModal from "../assetlists/assetdetailsmodal";

const DashboardInfoCards = () => {
  const [totalAssets, setTotalAssets] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalEvents, setTotalEvents] = useState(null);
  const [recentAssets, setRecentAssets] = useState([]);
  const [error, setError] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assetsResponse = await axios.get('http://localhost:5000/api/dashboard/total-assets');
        setTotalAssets(assetsResponse.data.totalAssets);

        const usersResponse = await axios.get('http://localhost:5000/api/dashboard/total-users');
        setTotalUsers(usersResponse.data.totalUsers);

        const eventsResponse = await axios.get('http://localhost:5000/api/dashboard/total-events');
        setTotalEvents(eventsResponse.data.totalEvents);

        const recentAssetsResponse = await axios.get('http://localhost:5000/api/dashboard/recent-assets');
        setRecentAssets(recentAssetsResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to fetch dashboard data');
      }
    };

    fetchData();
  }, []);

  const handleAssetDetailsClick = async (asset) => {
    try {
      const response = await axios.get('http://localhost:5000/api/Assets/read');
      const allAssets = response.data;
      const selectedAsset = allAssets.find(a => a.asset_id === asset.asset_id);
      
      if (selectedAsset) {
        setSelectedAsset(selectedAsset);
      } else {
        console.error("Asset not found");
      }
    } catch (error) {
      console.error("Error fetching asset details:", error);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <img src="completed-image.jpg" alt="Total Assets" className="rounded-md mb-4" />
          <h2 className="text-6xl font-bold text-yellow-500">
            {error ? 'Error' : totalAssets === null ? 'Loading...' : totalAssets}
          </h2>
          <p className="text-lg font-semibold mt-2">Total Assets</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <img src="in-process-image.jpg" alt="Total Users" className="rounded-md mb-4" />
          <h2 className="text-6xl font-bold text-yellow-500">
            {error ? 'Error' : totalUsers === null ? 'Loading...' : totalUsers}
          </h2>
          <p className="text-lg font-semibold mt-2">Total Users</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <img src="in-process-image.jpg" alt="Total Events" className="rounded-md mb-4" />
          <h2 className="text-6xl font-bold text-yellow-500">
            {error ? 'Error' : totalEvents === null ? 'Loading...' : totalEvents}
          </h2>
          <p className="text-lg font-semibold mt-2">Total Events</p>
        </div>

        {/* Add more cards here as needed */}
      </div>

      {/* Recent Added Assets Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Recently Added Assets</h2>
          <div className="space-y-4">
            {recentAssets.map((asset) => (
              <div key={asset.asset_id} className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{asset.assetName}</p>
                  <p className="text-sm text-gray-500">
                    {moment(asset.createdDate).format('MMMM D, YYYY, h:mmA')}
                  </p>
                </div>
                <button 
                  className="bg-yellow-500 text-white px-4 py-1 rounded-full"
                  onClick={() => handleAssetDetailsClick(asset)}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Announcements */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">June 10, 2023, 10:00AM</p>
                <p className="text-gray-600">Start of Summer Term</p>
              </div>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-full">Read</button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">May 28, 2023, 4:00PM</p>
                <p className="text-gray-600">Employees' Retreat</p>
              </div>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-full">Read</button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">May 10, 2023, 10:30AM</p>
                <p className="text-gray-600">New Office Hours</p>
              </div>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-full">Read</button>
            </div>
            {/* Add more announcements as needed */}
          </div>
        </div>
      </div>

      {selectedAsset && (
        <AssetDetailsModal
          selectedAsset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />
      )}
    </div>
  );
};

export default DashboardInfoCards;
