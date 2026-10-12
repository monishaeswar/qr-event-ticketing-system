const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { TICKET_STATUS, USER_ROLES } = require('../utils/constants');

// @route   GET /api/admin/dashboard
const getDashboard = async (req, res, next) => {
  try {
    const [totalEvents, totalTickets, totalUsers, recentTickets] = await Promise.all([
      Event.countDocuments({ isActive: true }),
      Ticket.countDocuments(),
      User.countDocuments({ role: USER_ROLES.USER }),
      Ticket.find()
        .populate('event', 'title')
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    const revenue = await Ticket.aggregate([
      { $match: { status: { $ne: TICKET_STATUS.CANCELLED } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const checkedIn = await Ticket.countDocuments({ status: TICKET_STATUS.CHECKED_IN });

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
    next(err);
  }
};

// @route   GET /api/admin/bookings
const getAllBookings = async (req, res, next) => {
  try {
    const { eventId, status } = req.query;
    const query = {};
    if (eventId) query.event = eventId;
    if (status) query.status = status;

    const bookings = await Ticket.find(query)
      .populate('event', 'title date venue')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/admin/events/:eventId/stats
const getEventStats = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    const [totalBooked, checkedIn, cancelled] = await Promise.all([
      Ticket.countDocuments({ event: event._id, status: TICKET_STATUS.BOOKED }),
      Ticket.countDocuments({ event: event._id, status: TICKET_STATUS.CHECKED_IN }),
      Ticket.countDocuments({ event: event._id, status: TICKET_STATUS.CANCELLED }),
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
    next(err);
  }
};

module.exports = { getDashboard, getAllBookings, getEventStats };
