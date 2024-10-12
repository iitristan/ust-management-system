const Event = require('../models/events');

const createEvent = async (req, res) => {
  try {
    console.log("Received event data:", req.body);
    const eventData = {
      ...req.body,
      image: req.body.image || null
    };
    console.log("Processed event data:", eventData);
    const result = await Event.createEvent(eventData);
    console.log("Create event result:", result);
    res.status(201).json(result[0]);
  } catch (err) {
    console.error("Detailed error in createEvent:", err);
    res.status(500).json({ error: err.message || "Error creating event" });
  }
};

const readEvents = async (req, res) => {
  try {
    const events = await Event.readEvents();
    // Filter out completed events
    const activeEvents = events.filter(event => !event.is_completed);
    res.status(200).json(activeEvents);
  } catch (err) {
    res.status(500).json({ error: "Error reading events", details: err.toString() });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const result = await Event.updateEvent(uniqueId, req.body);
    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json({ error: "Event not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error updating event", details: err.toString() });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const result = await Event.deleteEvent(uniqueId);
    res.status(200).json({ message: "Event deleted successfully", updatedEvents: result });
  } catch (err) {
    res.status(500).json({ error: "Error deleting event", details: err.toString() });
  }
};

const completeEvent = async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const result = await Event.completeEvent(uniqueId);
    res.status(200).json({ message: "Event completed successfully", updatedEvent: result });
  } catch (err) {
    res.status(500).json({ error: "Error completing event", details: err.toString() });
  }
};

const getCompletedEvents = async (req, res) => {
  try {
    const completedEvents = await Event.getCompletedEvents();
    res.status(200).json(completedEvents);
  } catch (err) {
    res.status(500).json({ error: "Error fetching completed events", details: err.toString() });
  }
};

module.exports = {
  createEvent,
  readEvents,
  updateEvent,
  deleteEvent,
  completeEvent,
  getCompletedEvents
};
