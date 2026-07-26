const generateQRCode = require('../utils/generateQRCode');

// Builds the payload that gets encoded into a ticket's QR image, and
// decodes/validates scans coming back from the QRScanner page.
const buildTicketQRPayload = ({ ticketId, eventId, userId, quantity }) => ({
  ticketId,
  eventId,
  userId,
  quantity,
});

const createTicketQRCode = async (ticketFields) => {
  const payload = buildTicketQRPayload(ticketFields);
  return generateQRCode(payload);
};

const parseScannedQRData = (qrData) => {
  try {
    return typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
  } catch {
    // Allow manual entry of a bare ticket ID string (not JSON-encoded).
    if (typeof qrData === 'string' && qrData.trim()) {
      return { ticketId: qrData.trim() };
    }
    throw new Error('Invalid QR code data');
  }
};

module.exports = { createTicketQRCode, parseScannedQRData };
