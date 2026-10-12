const { sendTicketEmail } = require('./emailService');
const logger = require('../utils/logger');

// Single entry point for "tell the user something happened". Currently
// only email is wired up, but callers don't need to change if SMS/push
// are added later - just extend this module.
const notifyTicketBooked = async ({ to, attendeeName, event, ticket }) => {
  try {
    await sendTicketEmail({ to, attendeeName, event, ticket });
  } catch (err) {
    // Booking should still succeed even if the notification fails.
    logger.error('notifyTicketBooked failed:', err.message);
  }
};

module.exports = { notifyTicketBooked };
