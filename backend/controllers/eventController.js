const Event = require('../models/Event');

// @route   GET /api/events
const listEvents = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const query = { isActive: true };

    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    const events = await Event.find(query).populate('createdBy', 'name email').sort({ date: 1 });
    res.json({ success: true, count: events.length, events });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/events/:id
const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, event });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/events (Admin only)
const createEvent = async (req, res, next) => {
  try {
    const eventData = { ...req.body, createdBy: req.user._id };
    if (req.file) {
      eventData.imageUrl = `/uploads/events/${req.file.filename}`;
    }
    const event = await Event.create(eventData);
    res.status(201).json({ success: true, message: 'Event created', event });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/events/:id (Admin only)
const updateEvent = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      updates.imageUrl = `/uploads/events/${req.file.filename}`;
    }
    const event = await Event.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, message: 'Event updated', event });
  } catch (err) {
    next(err);
  }
};

// @route   DELETE /api/events/:id (Admin only) - soft delete
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, message: 'Event deactivated' });
  } catch (err) {
    next(err);
  }
};

module.exports = { listEvents, getEvent, createEvent, updateEvent, deleteEvent };
