import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faDollarSign, faHandHolding } from '@fortawesome/free-solid-svg-icons';

const InfoCards = ({ totalAssets, totalCost, assetsForBorrowing }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Assets Card */}
      <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center">
          <div className="bg-blue-100 rounded-full p-3 mr-4">
            <FontAwesomeIcon icon={faBox} className="text-blue-500 text-xl" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-600">Total Assets</h2>
            <p className="text-2xl font-bold text-gray-800 mt-1">{totalAssets}</p>
          </div>
        </div>
      </div>

      {/* Total Cost Card */}
      <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center">
          <div className="bg-green-100 rounded-full p-3 mr-4">
            <FontAwesomeIcon icon={faDollarSign} className="text-green-500 text-xl" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-600">Total Cost</h2>
            <p className="text-2xl font-bold text-gray-800 mt-1">{totalCost}</p>
          </div>
        </div>
      </div>

      {/* Assets for Borrowing Card */}
      <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center">
          <div className="bg-purple-100 rounded-full p-3 mr-4">
            <FontAwesomeIcon icon={faHandHolding} className="text-purple-500 text-xl" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-600">Assets for Borrowing</h2>
            <p className="text-2xl font-bold text-gray-800 mt-1">{assetsForBorrowing}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCards;
