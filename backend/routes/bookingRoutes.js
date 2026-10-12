const express = require('express');
const {
  createBooking,
  getMyBookings,
  getBookingById,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { validateBooking } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/', protect, validateBooking, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/:id', protect, getBookingById);

module.exports = router;
