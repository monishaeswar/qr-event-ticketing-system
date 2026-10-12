const express = require('express');
const { checkIn, getTicketQRCode } = require('../controllers/qrController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const router = express.Router();

router.post('/checkin', protect, adminOnly, checkIn);
router.get('/:ticketId', protect, getTicketQRCode);

module.exports = router;
