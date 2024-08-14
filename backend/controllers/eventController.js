const { ObjectId } = require('mongodb');
const connectDB = require('../config/db');

const getEvents = async (req, res) => {
  const db = await connectDB();
  const collection = db.collection('events');

  try {
    if (req.query.id) {
      const id = req.query.id;
      const event = await collection.findOne({ _id: new ObjectId(id) });
      if (event) return res.json(event);
      return res.status(404).json({ message: 'Event not found' });
    }

    if (req.query.type === 'latest') {
      const limit = parseInt(req.query.limit) || 5;
      const page = parseInt(req.query.page) || 1;
      const skip = (page - 1) * limit;

      const events = await collection.find().sort({ schedule: -1 }).skip(skip).limit(limit).toArray();
      return res.json(events);
    }

    const events = await collection.find().toArray();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events' });
  }
};

const getEventById = async (req, res) => {
  const db = await connectDB();
  const collection = db.collection('events');
  const id = req.params.id;

  try {
    const event = await collection.findOne({ _id: new ObjectId(id) });
    if (event) return res.json(event);
    return res.status(404).json({ message: 'Event not found' });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching event' });
  }
};

const createEvent = async (req, res) => {
  const db = await connectDB();
  const collection = db.collection('events');
  const event = req.body;

  try {
    const result = await collection.insertOne(event);
    res.json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: 'Error creating event' });
  }
};

const updateEvent = async (req, res) => {
  const db = await connectDB();
  const collection = db.collection('events');
  const id = req.params.id;
  const event = req.body;

  try {
    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: event });
    if (result.matchedCount) return res.json({ message: 'Event updated successfully' });
    res.status(404).json({ message: 'Event not found' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating event' });
  }
};

const deleteEvent = async (req, res) => {
  const db = await connectDB();
  const collection = db.collection('events');
  const id = req.params.id;

  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount) return res.json({ message: 'Event deleted successfully' });
    res.status(404).json({ message: 'Event not found' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting event' });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
