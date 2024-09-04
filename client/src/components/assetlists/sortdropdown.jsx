import React from 'react';

const SortDropdown = ({ onSort }) => {
  const handleSortChange = (event) => {
    onSort(event.target.value);
  };

  return (
    <div className="sort-dropdown-container">
      <select
        onChange={handleSortChange}
        className="sort-dropdown"
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
