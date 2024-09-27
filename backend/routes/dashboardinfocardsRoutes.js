const express = require('express');
const router = express.Router();
const dashboardInfoCardsController = require('../controllers/dashboardinfocardsController');

router.get('/total-assets', dashboardInfoCardsController.getTotalAssets);
router.get('/total-users', dashboardInfoCardsController.getTotalUsers);
router.get('/total-events', dashboardInfoCardsController.getTotalEvents);
router.get('/recent-assets', dashboardInfoCardsController.getRecentlyAddedAssets);

module.exports = router;
