import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SupplierInfoCard from '../components/supplier/supplierinfocard';
import SupplierTable from '../components/supplier/suppliertable';
import AddSupplier from '../components/supplier/addsupplier';
import EditSupplier from '../components/supplier/editsupplier';
import SupplierSearch from '../components/supplier/suppliersearch';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [supplierToEdit, setSupplierToEdit] = useState(null);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [totalSuppliers, setTotalSuppliers] = useState(0);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/suppliers');
      setSuppliers(response.data);
      setTotalSuppliers(response.data.length);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleSupplierAdded = (newSupplier) => {
    setSuppliers([...suppliers, newSupplier]);
  };

  const handleDelete = async (supplier_id) => {
    try {
      await axios.delete(`http://localhost:5000/api/suppliers/${supplier_id}`);
      setSuppliers(suppliers.filter(supplier => supplier.supplier_id !== supplier_id));
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  const handleEdit = (supplier) => {
    setSupplierToEdit(supplier);
    setIsEditModalOpen(true);
  };

  const handleSupplierUpdated = (updatedSupplier) => {
    setSuppliers(suppliers.map(supplier => 
      supplier.supplier_id === updatedSupplier.supplier_id ? updatedSupplier : supplier
    ));
    setSupplierToEdit(null);
    setIsEditModalOpen(false);
  };

  const handleSearch = (searchTerm) => {
    const filtered = suppliers.filter(supplier =>
      supplier.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    setFilteredSuppliers(filtered);
  };

  return (
    <div className="p-4">
      <SupplierInfoCard totalSuppliers={totalSuppliers} />
      <div className="flex justify-between items-center mb-4">
        <SupplierSearch handleSearch={handleSearch} />
        <AddSupplier 
          onSupplierAdded={handleSupplierAdded} 
          onSupplierUpdated={handleSupplierUpdated}
          supplierToEdit={supplierToEdit}
        />
      </div>
      <SupplierTable 
        suppliers={filteredSuppliers.length > 0 ? filteredSuppliers : suppliers} 
        onDelete={handleDelete} 
        onEdit={handleEdit} 
      />
      {isEditModalOpen && (
        <EditSupplier
          supplier={supplierToEdit}
          onSupplierUpdated={handleSupplierUpdated}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default SupplierList;
