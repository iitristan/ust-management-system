import React, { useState } from 'react';
import Button from './button';

const QuantityForBorrowingModal = ({ isOpen, onClose, onConfirm, maxQuantity }) => {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (quantity > maxQuantity) {
      alert(`You cannot borrow more than the available quantity of ${maxQuantity}.`);
      return;
    }
    onConfirm(quantity); // Pass the confirmed quantity to the parent component
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Set Quantity for Borrowing</h2>
        <input
          type="number"
          min="1"
          max={maxQuantity}
          value={quantity}
          onChange={(e) => {
            const value = Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1));
            setQuantity(value);
          }} 
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
        />
        <div className="flex justify-end space-x-4">
          <Button onClick={onClose} variant="secondary">Cancel</Button>
          <Button onClick={handleConfirm} variant="primary">Confirm</Button>
        </div>
      </div>
    </div>
  );
};

export default QuantityForBorrowingModal;
