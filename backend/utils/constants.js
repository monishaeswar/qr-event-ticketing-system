module.exports = {
  EVENT_CATEGORIES: ['Conference', 'Concert', 'Workshop', 'Seminar', 'Sports', 'Other'],

  TICKET_STATUS: {
    BOOKED: 'booked',
    CHECKED_IN: 'checked-in',
    CANCELLED: 'cancelled',
  },

  BOOKING_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
  },

  PAYMENT_STATUS: {
    PENDING: 'pending',
    SUCCESS: 'success',
    FAILED: 'failed',
    REFUNDED: 'refunded',
  },

  USER_ROLES: {
    USER: 'user',
    ADMIN: 'admin',
  },

  MAX_TICKETS_PER_BOOKING: 10,
  JWT_EXPIRY: '7d',
};
