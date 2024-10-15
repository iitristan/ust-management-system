const express = require('express');
const router = express.Router();
const borrowLogsController = require('../controllers/borrowLogsController');

router.post('/', borrowLogsController.createBorrowLog);
router.get('/:assetId', borrowLogsController.getBorrowLogs);
router.put('/return', borrowLogsController.updateBorrowLogReturnDate);

module.exports = router;

