const express = require('express');
const {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { uploadEventImage } = require('../middleware/uploadMiddleware');
const { validateEvent } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/', listEvents);
router.get('/:id', getEvent);
router.post('/', protect, adminOnly, uploadEventImage.single('image'), validateEvent, createEvent);
router.put('/:id', protect, adminOnly, uploadEventImage.single('image'), updateEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);

module.exports = router;
