const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const generateTicketId = require('../utils/generateTicketId');
const { createTicketQRCode } = require('../services/qrService');
const { notifyTicketBooked } = require('../services/notificationService');
const { TICKET_STATUS } = require('../utils/constants');
const logger = require('../utils/logger');

// Shared by the legacy direct-booking flow (POST /api/tickets/book) and the
// newer Booking/Payment flow (bookingController) - both end up here to
// actually create the Ticket + QR code + decrement seats + notify.
const issueTicket = async ({ event, user, quantity, bookingId }) => {
  const ticketId = generateTicketId();
  const totalAmount = event.ticketPrice * quantity;

  const qrCode = await createTicketQRCode({
    ticketId,
    eventId: event._id,
    userId: user._id,
    quantity,
  });

  const ticket = await Ticket.create({
    ticketId,
    booking: bookingId,
    event: event._id,
    user: user._id,
    quantity,
    totalAmount,
    qrCode,
    attendeeName: user.name,
    attendeeEmail: user.email,
    status: TICKET_STATUS.BOOKED,
  });

  await Event.findByIdAndUpdate(event._id, { $inc: { availableSeats: -quantity } });

  notifyTicketBooked({
    to: user.email,
    attendeeName: user.name,
    event,
    ticket,
  }).catch((err) => logger.error('notifyTicketBooked error:', err.message));

  return Ticket.findById(ticket._id).populate('event', 'title date time venue');
};

// @route   POST /api/tickets/book
// Direct booking - no explicit Booking/Payment record, kept for simplicity /
// backward compatibility with the original single-step flow.
const bookTicket = async (req, res, next) => {
  try {
    const { eventId, quantity } = req.body;

    const event = await Event.findById(eventId);
    if (!event || !event.isActive) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.availableSeats < quantity) {
      return res
        .status(400)
        .json({ success: false, message: `Only ${event.availableSeats} seats available` });
    }

    const ticket = await issueTicket({ event, user: req.user, quantity });

    res
      .status(201)
      .json({ success: true, message: 'Ticket booked! Check your email.', ticket });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/tickets/my
const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id })
      .populate('event', 'title date time venue category imageUrl')
      .sort({ createdAt: -1 });
    res.json({ success: true, tickets });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/tickets/:ticketId
const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.ticketId })
      .populate('event')
      .populate('user', 'name email');
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.json({ success: true, ticket });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/tickets/cancel/:ticketId
const cancelTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.ticketId, user: req.user._id });
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    if (ticket.status !== TICKET_STATUS.BOOKED) {
      return res.status(400).json({ success: false, message: 'Ticket cannot be cancelled' });
    }

    ticket.status = TICKET_STATUS.CANCELLED;
    await ticket.save();
    await Event.findByIdAndUpdate(ticket.event, { $inc: { availableSeats: ticket.quantity } });

    res.json({ success: true, message: 'Ticket cancelled successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { issueTicket, bookTicket, getMyTickets, getTicketById, cancelTicket };
