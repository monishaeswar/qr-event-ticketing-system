const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
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
      enum: ['booked', 'checked-in', 'cancelled'],
      default: 'booked',
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
