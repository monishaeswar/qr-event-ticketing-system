const mongoose = require('mongoose');
const { TICKET_STATUS } = require('../utils/constants');

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
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
    qrCode: {
      type: String, // Base64 encoded QR image
    },
    status: {
      type: String,
      enum: Object.values(TICKET_STATUS),
      default: TICKET_STATUS.BOOKED,
    },
    checkedInAt: {
      type: Date,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    attendeeName: {
      type: String,
      required: true,
    },
    attendeeEmail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema);
