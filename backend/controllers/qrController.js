const Ticket = require('../models/Ticket');
const { parseScannedQRData } = require('../services/qrService');
const { TICKET_STATUS } = require('../utils/constants');

// @route   POST /api/qr/checkin  (also mounted at /api/admin/checkin for
// backward compatibility with the original single-file routes)
const checkIn = async (req, res, next) => {
  try {
    const { qrData } = req.body;

    let parsedQR;
    try {
      parsedQR = parseScannedQRData(qrData);
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid QR code data' });
    }

    const ticket = await Ticket.findOne({ ticketId: parsedQR.ticketId })
      .populate('event', 'title date time venue')
      .populate('user', 'name email');

    if (!ticket) {
      return res.status(404).json({ success: false, message: '❌ Ticket not found' });
    }

    if (ticket.status === TICKET_STATUS.CHECKED_IN) {
      return res.status(400).json({
        success: false,
        message: '⚠️ Already checked in',
        ticket,
        checkedInAt: ticket.checkedInAt,
      });
    }

    if (ticket.status === TICKET_STATUS.CANCELLED) {
      return res.status(400).json({ success: false, message: '❌ Ticket is cancelled' });
    }

    ticket.status = TICKET_STATUS.CHECKED_IN;
    ticket.checkedInAt = new Date();
    await ticket.save();

    res.json({
      success: true,
      message: '✅ Check-in successful!',
      ticket,
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/qr/:ticketId - re-fetch a ticket's QR image (e.g. to
// redisplay it in "My Tickets" without re-emailing it)
const getTicketQRCode = async (req, res, next) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.ticketId });
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.json({ success: true, qrCode: ticket.qrCode });
  } catch (err) {
    next(err);
  }
};

module.exports = { checkIn, getTicketQRCode };
