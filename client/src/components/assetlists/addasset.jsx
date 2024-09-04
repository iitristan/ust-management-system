import React, { useState, useCallback } from 'react';
import Modal from './modal';
import Button from './button';


const AddAsset = ({ onAddAsset, categories = [], locations = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleAddAsset = useCallback(
    (newAsset) => {
      onAddAsset(newAsset);
      closeModal();
    },
    [onAddAsset, closeModal]
  );

  return (
    <>
      <Button
        className="bg-[#68C231] text-[#343B3F] text-[10px] font-semibold"
        onClick={openModal}
      >
        Add Asset
      </Button>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        categories={categories}
        locations={locations}
        onAddAsset={handleAddAsset}
      />
    </>
  );
};

export default AddAsset;
