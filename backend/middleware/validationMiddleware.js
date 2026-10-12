const { body, validationResult } = require('express-validator');
const { EVENT_CATEGORIES } = require('../utils/constants');

// Collects express-validator errors and short-circuits with a 400 before
// the request reaches a controller.
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('A valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidation,
];

const validateLogin = [
  body('email').isEmail().withMessage('A valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

const validateEvent = [
  body('title').trim().notEmpty().withMessage('Event title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('A valid date is required'),
  body('time').notEmpty().withMessage('Time is required'),
  body('venue').trim().notEmpty().withMessage('Venue is required'),
  body('category').optional().isIn(EVENT_CATEGORIES).withMessage('Invalid category'),
  body('ticketPrice').isFloat({ min: 0 }).withMessage('Ticket price must be a positive number'),
  body('totalSeats').isInt({ min: 1 }).withMessage('Total seats must be at least 1'),
  handleValidation,
];

const validateBooking = [
  body('eventId').notEmpty().withMessage('eventId is required'),
  body('quantity').isInt({ min: 1, max: 10 }).withMessage('Quantity must be between 1 and 10'),
  handleValidation,
];

module.exports = {
  handleValidation,
  validateRegister,
  validateLogin,
  validateEvent,
  validateBooking,
};
