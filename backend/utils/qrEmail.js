const QRCode = require('qrcode');
const nodemailer = require('nodemailer');

// Generate QR Code as base64
const generateQRCode = async (ticketData) => {
  try {
    const qrString = JSON.stringify(ticketData);
    const qrDataUrl = await QRCode.toDataURL(qrString, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: 300,
    });
    return qrDataUrl;
  } catch (err) {
    throw new Error('QR Code generation failed: ' + err.message);
  }
};

// Configure nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send ticket email with QR code
const sendTicketEmail = async ({ to, attendeeName, event, ticket }) => {
  const transporter = createTransporter();
  const qrBase64 = ticket.qrCode.split(',')[1]; // strip data:image/png;base64,

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 30px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .ticket-body { padding: 30px; }
        .event-title { font-size: 22px; font-weight: bold; color: #333; margin-bottom: 5px; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .detail-label { color: #888; font-size: 14px; }
        .detail-value { font-weight: bold; color: #333; }
        .qr-section { text-align: center; padding: 30px; background: #f9f9f9; margin-top: 20px; border-radius: 8px; }
        .qr-section img { border: 4px solid #667eea; border-radius: 8px; }
        .ticket-id { font-size: 12px; color: #999; margin-top: 10px; }
        .footer { background: #333; color: #aaa; text-align: center; padding: 15px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎟 Your E-Ticket</h1>
          <p>Booking Confirmed!</p>
        </div>
        <div class="ticket-body">
          <p>Dear <strong>${attendeeName}</strong>, your booking is confirmed!</p>
          <div class="event-title">${event.title}</div>
          <div class="detail-row">
            <span class="detail-label">📅 Date</span>
            <span class="detail-value">${new Date(event.date).toDateString()}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">⏰ Time</span>
            <span class="detail-value">${event.time}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">📍 Venue</span>
            <span class="detail-value">${event.venue}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">🎫 Quantity</span>
            <span class="detail-value">${ticket.quantity} Ticket(s)</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">💰 Total Paid</span>
            <span class="detail-value">₹${ticket.totalAmount}</span>
          </div>
          <div class="qr-section">
            <p><strong>Scan this QR code at the entrance</strong></p>
            <img src="cid:qrcode" width="200" height="200" alt="QR Code" />
            <div class="ticket-id">Ticket ID: ${ticket.ticketId}</div>
          </div>
        </div>
        <div class="footer">
          EventTicket System &bull; Please present this QR code at the venue
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"EventTicket System" <${process.env.EMAIL_USER}>`,
    to,
    subject: `🎟 Your Ticket for ${event.title}`,
    html: htmlContent,
    attachments: [
      {
        filename: 'ticket-qr.png',
        content: qrBase64,
        encoding: 'base64',
        cid: 'qrcode',
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { generateQRCode, sendTicketEmail };
