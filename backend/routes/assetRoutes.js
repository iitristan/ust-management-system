const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');

router.post('/create', assetController.createAsset);
router.get('/read', assetController.readAssets);
router.put('/update/:id', assetController.updateAsset);
router.delete('/delete/:id', assetController.deleteAsset);
router.put('/:id/active', assetController.updateAssetActiveStatus);
router.get('/active/count', assetController.getTotalActiveAssets);
router.get('/active/count', assetController.getTotalActiveAssets);
router.get('/available/count', assetController.getTotalAvailableAssets);
router.get('/sorted', assetController.getAssetsSortedByActiveStatus);

module.exports = router;
