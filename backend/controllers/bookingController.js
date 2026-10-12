const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Event = require('../models/Event');
const { issueTicket } = require('./ticketController');
const paymentService = require('../services/paymentService');
const { BOOKING_STATUS, PAYMENT_STATUS } = require('../utils/constants');
const logger = require('../utils/logger');

// @route   POST /api/bookings
// Creates a Booking, charges payment (simulated - see services/paymentService.js),
// then issues the Ticket. This is the richer alternative to the legacy
// one-step POST /api/tickets/book, useful once a real payment gateway is wired in.
const createBooking = async (req, res, next) => {
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

    const totalAmount = event.ticketPrice * quantity;

    const booking = await Booking.create({
      event: event._id,
      user: req.user._id,
      quantity,
      totalAmount,
      status: BOOKING_STATUS.PENDING,
    });

    try {
      const charge = await paymentService.charge({ amount: totalAmount });

      const payment = await Payment.create({
        booking: booking._id,
        user: req.user._id,
        amount: totalAmount,
        status: charge.status,
        transactionId: charge.transactionId,
        paidAt: charge.paidAt,
      });

      if (charge.status !== PAYMENT_STATUS.SUCCESS) {
        booking.status = BOOKING_STATUS.CANCELLED;
        booking.payment = payment._id;
        await booking.save();
        return res.status(402).json({ success: false, message: 'Payment failed' });
      }

      const ticket = await issueTicket({
        event,
        user: req.user,
        quantity,
        bookingId: booking._id,
      });

      booking.status = BOOKING_STATUS.CONFIRMED;
      booking.payment = payment._id;
      booking.ticket = ticket._id;
      await booking.save();

      res.status(201).json({
        success: true,
        message: 'Booking confirmed! Check your email for the ticket.',
        booking,
        ticket,
      });
    } catch (paymentErr) {
      booking.status = BOOKING_STATUS.CANCELLED;
      await booking.save();
      logger.error('Booking payment/issuance failed:', paymentErr.message);
      throw paymentErr;
    }
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/bookings/my
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event', 'title date time venue imageUrl')
      .populate('payment')
      .populate('ticket')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/bookings/:id
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id })
      .populate('event')
      .populate('payment')
      .populate('ticket');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};

module.exports = { createBooking, getMyBookings, getBookingById };
