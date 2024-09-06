import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faDollarSign, faHandHolding } from '@fortawesome/free-solid-svg-icons';

const InfoCards = ({ totalAssets, totalCost, assetsForBorrowing }) => {
  return (
    <div className="flex justify-between p-2">
      {/* Total Assets Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 m-4 w-full sm:w-1/3 md:w-1/3 lg:w-1/3 flex items-center">
        <FontAwesomeIcon icon={faBox} className="h-6 w-6 text-black-500 mr-4" />
        <div>
          <h2 className="text-xl font-semibold text-black-700">Total Assets</h2>
          <p className="text-3xl font-bold text-black-900 mt-2">{totalAssets}</p>
        </div>
      </div>

      {/* Total Cost Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 m-4 w-full sm:w-1/3 md:w-1/3 lg:w-1/3 flex items-center">
        <FontAwesomeIcon icon={faDollarSign} className="h-6 w-6 text-black-500 mr-4" />
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Total Cost</h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalCost}</p>
        </div>
      </div>

      {/* Assets for Borrowing Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 m-4 w-full sm:w-1/3 md:w-1/3 lg:w-1/3 flex items-center">
        <FontAwesomeIcon icon={faHandHolding} className="h-6 w-6 text-gray-500 mr-4" />
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Assets for Borrowing</h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">{assetsForBorrowing}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoCards;
