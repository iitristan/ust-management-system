// SortDropdown.jsx
import React from 'react';

const SortDropdown = ({ onSort }) => {
  const handleSortChange = (event) => {
    onSort(event.target.value);
  };

  return (
    <div className="sort-dropdown">
      <select
        onChange={handleSortChange}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        <option value="">Sort By</option>
        <option value="dateAsc">Date Created: Oldest to Newest</option>
        <option value="dateDesc">Date Created: Newest to Oldest</option>
        <option value="quantityAsc">Quantity: Lowest to Highest</option>
        <option value="quantityDesc">Quantity: Highest to Lowest</option>
        <option value="borrowActive">Borrow: Active</option>
        <option value="borrowInactive">Borrow: Inactive</option>
        <option value="nameAsc">Name: A-Z</option>
        <option value="nameDesc">Name: Z-A</option>
      </select>
    </div>
  );
};

export default SortDropdown;
