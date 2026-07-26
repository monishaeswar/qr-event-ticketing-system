const QRCode = require('qrcode');

// Encodes arbitrary ticket data into a base64 PNG data URL.
// Kept separate from services/qrService.js so this pure function can be
// unit tested without touching the DB or filesystem.
const generateQRCode = async (payload) => {
  try {
    const qrString = typeof payload === 'string' ? payload : JSON.stringify(payload);
    return await QRCode.toDataURL(qrString, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: 300,
    });
  } catch (err) {
    throw new Error('QR Code generation failed: ' + err.message);
  }
};

module.exports = generateQRCode;
