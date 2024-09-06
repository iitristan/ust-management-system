import React from 'react';

const SortDropdown = ({ onSort }) => {
  return (
    <select onChange={(e) => onSort(e.target.value)}>
      <option value="">Sort by...</option>
      <option value="dateAsc">Date (Oldest First)</option>
      <option value="dateDesc">Date (Newest First)</option>
      <option value="quantityAsc">Quantity (Low to High)</option>
      <option value="quantityDesc">Quantity (High to Low)</option>
      <option value="nameAsc">Name (A-Z)</option>
      <option value="nameDesc">Name (Z-A)</option>
      <option value="activeFirst">Active First</option>
      <option value="inactiveFirst">Inactive First</option>
    </select>
  );
};

export default SortDropdown;
