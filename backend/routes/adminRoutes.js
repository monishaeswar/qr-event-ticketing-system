const express = require('express');
const { getDashboard, getAllBookings, getEventStats } = require('../controllers/adminController');
const { checkIn } = require('../controllers/qrController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/dashboard', protect, adminOnly, getDashboard);
router.get('/bookings', protect, adminOnly, getAllBookings);
// Kept here for backward compatibility with the original API shape -
// the canonical route is now POST /api/qr/checkin (see qrRoutes.js).
router.post('/checkin', protect, adminOnly, checkIn);
router.get('/events/:eventId/stats', protect, adminOnly, getEventStats);

module.exports = router;
