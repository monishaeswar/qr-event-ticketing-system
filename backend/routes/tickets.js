const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');
const { generateQRCode, sendTicketEmail } = require('../utils/qrEmail');

const router = express.Router();

// @route   POST /api/tickets/book
router.post('/book', protect, async (req, res) => {
  try {
    const { eventId, quantity } = req.body;

    const event = await Event.findById(eventId);
    if (!event || !event.isActive) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.availableSeats < quantity) {
      return res.status(400).json({ success: false, message: `Only ${event.availableSeats} seats available` });
    }

    const ticketId = `EVT-${uuidv4().substring(0, 8).toUpperCase()}`;
    const totalAmount = event.ticketPrice * quantity;

    // Generate QR code with ticket info
    const qrData = { ticketId, eventId: event._id, userId: req.user._id, quantity };
    const qrCode = await generateQRCode(qrData);

    const ticket = await Ticket.create({
      ticketId,
      event: event._id,
      user: req.user._id,
      quantity,
      totalAmount,
      qrCode,
      attendeeName: req.user.name,
      attendeeEmail: req.user.email,
    });

    // Decrease available seats
    await Event.findByIdAndUpdate(eventId, { $inc: { availableSeats: -quantity } });

    // Send email (non-blocking)
    sendTicketEmail({
      to: req.user.email,
      attendeeName: req.user.name,
      event,
      ticket,
    }).catch((err) => console.error('Email send error:', err));

    const populatedTicket = await Ticket.findById(ticket._id).populate('event', 'title date time venue');
    res.status(201).json({ success: true, message: 'Ticket booked! Check your email.', ticket: populatedTicket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/tickets/my
router.get('/my', protect, async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id })
      .populate('event', 'title date time venue category imageUrl')
      .sort({ createdAt: -1 });
    res.json({ success: true, tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/tickets/:ticketId
router.get('/:ticketId', protect, async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.ticketId })
      .populate('event')
      .populate('user', 'name email');
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/tickets/cancel/:ticketId
router.post('/cancel/:ticketId', protect, async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.ticketId, user: req.user._id });
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    if (ticket.status !== 'booked') {
      return res.status(400).json({ success: false, message: 'Ticket cannot be cancelled' });
    }

    ticket.status = 'cancelled';
    await ticket.save();
    await Event.findByIdAndUpdate(ticket.event, { $inc: { availableSeats: ticket.quantity } });

    res.json({ success: true, message: 'Ticket cancelled successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
