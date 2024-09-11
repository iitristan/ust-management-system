const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventsController');

router.post('/create', eventController.createEvent);
router.get('/read', eventController.readEvents);
router.put('/update/:uniqueId', eventController.updateEvent);
router.delete('/delete/:uniqueId', eventController.deleteEvent);

module.exports = router;
