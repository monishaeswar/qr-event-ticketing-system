const mongoose = require('mongoose');
const { BOOKING_STATUS } = require('../utils/constants');

// A Booking represents the *intent* to reserve seats and is created before
// payment/ticket issuance. Once payment succeeds, a Ticket (with its QR
// code) is generated and linked back to this booking via `ticket`.
const bookingSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
