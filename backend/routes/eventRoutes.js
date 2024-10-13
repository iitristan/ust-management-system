const express = require('express');
const router = express.Router();
const Event = require('../models/events');
const { getEventById, updateAssetQuantity } = require('../models/events');
const eventController = require('../controllers/eventsController');

router.post('/create', eventController.createEvent);
router.get('/read', eventController.readEvents);
router.put('/update/:uniqueId', eventController.updateEvent);
router.delete('/delete/:uniqueId', eventController.deleteEvent);
router.get('/completed', eventController.getCompletedEvents);
router.put('/:uniqueId/complete', eventController.completeEvent);

router.get('/:id', async (req, res) => {
  try {
    const event = await getEventById(req.params.id);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:eventId/updateAssetQuantity', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { assetId, newQuantity, quantityDifference } = req.body;
    const sse = req.app.get('sse');
    const updatedQuantity = await updateAssetQuantity(eventId, assetId, newQuantity, quantityDifference, sse);
    res.json({ success: true, updatedAssetQuantity: updatedQuantity });
  } catch (error) {
    console.error('Error updating asset quantity:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
