const express = require('express');
const {
  bookTicket,
  getMyTickets,
  getTicketById,
  cancelTicket,
} = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/book', protect, bookTicket);
router.get('/my', protect, getMyTickets);
router.get('/:ticketId', protect, getTicketById);
router.post('/cancel/:ticketId', protect, cancelTicket);

module.exports = router;
