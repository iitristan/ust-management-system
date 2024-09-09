const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventsController');

router.post('/create', eventController.createEvent);
router.get('/read', eventController.readEvents);
router.put('/update/:id', eventController.updateEvent);
router.delete('/delete/:id', eventController.deleteEvent);

module.exports = router;
