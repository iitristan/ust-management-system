import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

const SupplierTable = ({ suppliers, onDelete, onEdit }) => {
  return (
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-4 border-b">Supplier ID</th>
          <th className="py-2 px-4 border-b">Supplier Name</th>
          <th className="py-2 px-4 border-b">Product</th>
          <th className="py-2 px-4 border-b">Street Address</th>
          <th className="py-2 px-4 border-b">City</th>
          <th className="py-2 px-4 border-b">Contact No.</th>
          <th className="py-2 px-4 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        {suppliers.map((supplier) => (
          <tr key={supplier.supplier_id}>
            <td className="py-2 px-4 border-b">{supplier.supplier_id}</td>
            <td className="py-2 px-4 border-b">{supplier.name}</td>
            <td className="py-2 px-4 border-b">{supplier.product}</td>
            <td className="py-2 px-4 border-b">{supplier.streetaddress}</td>
            <td className="py-2 px-4 border-b">{supplier.city}</td>
            <td className="py-2 px-4 border-b">{supplier.contactno}</td>
            <td className="py-2 px-4 border-b">
              <button onClick={() => onEdit(supplier)} className="text-blue-500 mr-2">
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button onClick={() => onDelete(supplier.supplier_id)} className="text-red-500">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </td>   
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SupplierTable;
