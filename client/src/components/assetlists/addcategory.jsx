import React, { useState, useCallback } from 'react';
import Button from './button';
import axios from 'axios';

const Modal = ({ isOpen, onClose, onSaveCategory, categories, onDeleteCategory }) => {
  const [category, setCategory] = useState('');

  const handleSaveCategory = async () => {
    if (!category.trim()) return; // Prevent saving if no category is provided
    try {
      const response = await axios.post('http://localhost:5000/api/categories', { categoryName: category });
      onSaveCategory(response.data.category_name);
      setCategory('');
      onClose();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDeleteCategory = async (cat) => {
    try {
      await axios.delete(`http://localhost:5000/api/categories/${encodeURIComponent(cat)}`);
      onDeleteCategory(cat);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Category Name</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">New Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Enter category name"
          />
        </div>
        <div className="mb-4">
          <h3 className="text-md font-semibold mb-2">Existing Categories</h3>
          <ul className="list-disc pl-5">
            {categories.map((cat, index) => (
              <li key={index} className="flex justify-between items-center mb-2">
                <span>{cat}</span>
                <Button
                  className="bg-red-500 text-white text-xs"
                  onClick={() => handleDeleteCategory(cat)}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button className="bg-gray-300" onClick={onClose}>Cancel</Button>
          <Button className="bg-green-500 text-white" onClick={handleSaveCategory}>Save Category</Button>
        </div>
      </div>
    </div>
  );
};

const AssetCategory = ({ onSaveCategory, onDeleteCategory, categories }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div className="group-button">
      <Button onClick={handleOpenModal}>
        Add Category
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSaveCategory={onSaveCategory}
        categories={categories}
        onDeleteCategory={onDeleteCategory}
      />
    </div>
  );
};

export default AssetCategory;
