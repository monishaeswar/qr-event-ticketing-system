const mongoose = require('mongoose');
const { PAYMENT_STATUS } = require('../utils/constants');

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    method: {
      type: String,
      default: 'simulated',
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    transactionId: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
