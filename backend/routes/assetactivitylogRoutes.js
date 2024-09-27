const express = require('express');
const router = express.Router();
const assetActivityLogController = require('../controllers/assetactivitylogController');

router.get('/:id', assetActivityLogController.getAssetActivityLogs);
router.post('/', assetActivityLogController.createAssetActivityLog);

module.exports = router;
