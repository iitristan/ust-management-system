const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventsController');
const Event = require('../models/events'); // Ensure this path is correct

router.post('/create', eventController.createEvent);
router.get('/read', eventController.readEvents);
router.put('/update/:uniqueId', eventController.updateEvent);
router.delete('/delete/:uniqueId', eventController.deleteEvent); // Use the deleteEvent function from the controller

module.exports = router;