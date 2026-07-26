const Payment = require('../models/Payment');

// @route   GET /api/payments/:id
const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.id, user: req.user._id }).populate(
      'booking'
    );
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.json({ success: true, payment });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/payments/my
const getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('booking')
      .sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPaymentById, getMyPayments };
