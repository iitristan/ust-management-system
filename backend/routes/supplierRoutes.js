const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

router.post('/', supplierController.createSupplier);
router.get('/', supplierController.getAllSuppliers);
router.put('/:supplier_id', supplierController.updateSupplier);
router.delete('/:supplier_id', supplierController.deleteSupplier);

module.exports = router;
