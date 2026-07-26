const PDFDocument = require('pdfkit');

// Streams a simple one-page ticket PDF (event details + embedded QR image)
// into a Buffer. Returns a Promise that resolves once the doc is finalized.
const generateTicketPDF = ({ event, ticket }) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A5', margin: 40 });
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20).fillColor('#667eea').text('🎟 E-Ticket', { align: 'center' });
      doc.moveDown();
      doc.fontSize(16).fillColor('#000').text(event.title, { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(11).fillColor('#555');
      doc.text(`Date: ${new Date(event.date).toDateString()}`);
      doc.text(`Time: ${event.time}`);
      doc.text(`Venue: ${event.venue}`);
      doc.text(`Attendee: ${ticket.attendeeName}`);
      doc.text(`Quantity: ${ticket.quantity}`);
      doc.text(`Total Paid: ₹${ticket.totalAmount}`);
      doc.text(`Ticket ID: ${ticket.ticketId}`);
      doc.moveDown();

      if (ticket.qrCode) {
        const base64 = ticket.qrCode.split(',')[1];
        const qrBuffer = Buffer.from(base64, 'base64');
        doc.image(qrBuffer, { fit: [180, 180], align: 'center' });
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = generateTicketPDF;
