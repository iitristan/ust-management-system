import React, { useState, useCallback } from 'react';

const Button = ({ className, onClick, children }) => (
  <button className={`px-4 py-2 rounded-lg ${className}`} onClick={onClick}>
    {children}
  </button>
);

const Modal = ({ isOpen, onClose, onSaveCategory }) => {
  const [category, setCategory] = useState('');

  const handleSaveCategory = () => {
    if (!category) return; // Prevent saving if no category is provided
    onSaveCategory({ category });
    setCategory('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Category Name</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2"></label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder=""
          />
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button className="bg-gray-300" onClick={onClose}>Cancel</Button>
          <Button className="bg-green-500 text-white" onClick={handleSaveCategory}>Save Category</Button>
        </div>
      </div>
    </div>
  );
};

const AssetCategory = ({ onSaveCategory }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div>
      <Button
        className="bg-[#68C231] text-[#343B3F] text-[10px] font-semibold"
        onClick={handleOpenModal}
      >
        Add Category 
      </Button>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSaveCategory={onSaveCategory}
      />
    </div>
  );
};

export default AssetCategory;
