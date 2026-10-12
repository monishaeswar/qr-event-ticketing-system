const express = require('express');
const { getPaymentById, getMyPayments } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/my', protect, getMyPayments);
router.get('/:id', protect, getPaymentById);

module.exports = router;
