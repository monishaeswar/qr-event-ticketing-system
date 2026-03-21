const express = require('express');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/dashboard
router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    const [totalEvents, totalTickets, totalUsers, recentTickets] = await Promise.all([
      Event.countDocuments({ isActive: true }),
      Ticket.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Ticket.find().populate('event', 'title').populate('user', 'name email').sort({ createdAt: -1 }).limit(10),
    ]);

    const revenue = await Ticket.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const checkedIn = await Ticket.countDocuments({ status: 'checked-in' });

    res.json({
      success: true,
      stats: {
        totalEvents,
        totalTickets,
        totalUsers,
        totalRevenue: revenue[0]?.total || 0,
        checkedIn,
      },
      recentTickets,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/admin/bookings
router.get('/bookings', protect, adminOnly, async (req, res) => {
  try {
    const { eventId, status } = req.query;
    let query = {};
    if (eventId) query.event = eventId;
    if (status) query.status = status;

    const bookings = await Ticket.find(query)
      .populate('event', 'title date venue')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/admin/checkin  — QR scan check-in
router.post('/checkin', protect, adminOnly, async (req, res) => {
  try {
    const { qrData } = req.body;

    let parsedQR;
    try {
      parsedQR = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid QR code data' });
    }

    const ticket = await Ticket.findOne({ ticketId: parsedQR.ticketId })
      .populate('event', 'title date time venue')
      .populate('user', 'name email');

    if (!ticket) {
      return res.status(404).json({ success: false, message: '❌ Ticket not found' });
    }

    if (ticket.status === 'checked-in') {
      return res.status(400).json({
        success: false,
        message: '⚠️ Already checked in',
        ticket,
        checkedInAt: ticket.checkedInAt,
      });
    }

    if (ticket.status === 'cancelled') {
      return res.status(400).json({ success: false, message: '❌ Ticket is cancelled' });
    }

    ticket.status = 'checked-in';
    ticket.checkedInAt = new Date();
    await ticket.save();

    res.json({
      success: true,
      message: '✅ Check-in successful!',
      ticket,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/admin/events/:eventId/stats
router.get('/events/:eventId/stats', protect, adminOnly, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    const [totalBooked, checkedIn, cancelled] = await Promise.all([
      Ticket.countDocuments({ event: event._id, status: 'booked' }),
      Ticket.countDocuments({ event: event._id, status: 'checked-in' }),
      Ticket.countDocuments({ event: event._id, status: 'cancelled' }),
    ]);

    res.json({
      success: true,
      eventStats: {
        event,
        totalBooked,
        checkedIn,
        cancelled,
        totalSold: totalBooked + checkedIn,
        occupancyRate: (((totalBooked + checkedIn) / event.totalSeats) * 100).toFixed(1),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
