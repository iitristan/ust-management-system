const Supplier = require('../models/supplier');

exports.createSupplier = async (req, res) => {
  try {
    const newSupplier = await Supplier.createSupplier(req.body);
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(500).json({ message: 'Error creating supplier', error: error.message });
  }
};

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.getAllSuppliers();
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suppliers', error: error.message });
  }
};

exports.updateSupplier = async (req, res) => {
  try {
    const updatedSupplier = await Supplier.updateSupplier(req.params.supplier_id, req.body);
    if (updatedSupplier) {
      res.status(200).json(updatedSupplier);
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating supplier', error: error.message });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const deletedSupplier = await Supplier.deleteSupplier(req.params.supplier_id);
    if (deletedSupplier) {
      res.status(200).json({ message: 'Supplier deleted successfully' });
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting supplier', error: error.message });
  }
};
