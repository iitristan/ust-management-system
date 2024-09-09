const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

router.get('/', locationController.getLocations);
router.post('/', locationController.addLocation);
router.delete('/:locationName', locationController.deleteLocation);

module.exports = router;
