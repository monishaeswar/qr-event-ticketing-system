const { PAYMENT_STATUS } = require('../utils/constants');
const logger = require('../utils/logger');

// NOTE: The original project never integrated a real payment gateway
// (Razorpay/Stripe/etc.) - tickets were booked directly for free. This
// service simulates a successful charge so the new Booking/Payment models
// have something real to plug a provider into later. Swap the body of
// `charge()` for an actual gateway call (create order -> verify signature)
// when you're ready to accept real payments.
const charge = async ({ amount, currency = 'INR', method = 'simulated' }) => {
  logger.info(`Simulating payment charge of ${currency} ${amount} via ${method}`);

  return {
    status: PAYMENT_STATUS.SUCCESS,
    transactionId: `SIM-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
    amount,
    currency,
    method,
    paidAt: new Date(),
  };
};

const refund = async ({ transactionId, amount }) => {
  logger.info(`Simulating refund of ${amount} for transaction ${transactionId}`);
  return {
    status: PAYMENT_STATUS.REFUNDED,
    refundedAt: new Date(),
  };
};

module.exports = { charge, refund };
