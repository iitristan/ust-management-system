import React from 'react';
import Button from './button';
import Modal from './modal';

const AddAsset = ({ onAddAsset, categories, locations, isModalOpen, onCloseModal, onOpenModal }) => {
  return (
    <>
      <Button
        className="bg-[#4169e1] text-white text-[10px] font-semibold"
        onClick={onOpenModal}
      >
        Add Asset
      </Button>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={onCloseModal}
          onAddAsset={onAddAsset} // Pass the onAddAsset prop
          categories={categories}
          locations={locations}
        />
      )}
    </>
  );
};

export default AddAsset;
