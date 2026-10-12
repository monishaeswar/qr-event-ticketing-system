const fs = require('fs');
const path = require('path');
const { getTransporter } = require('../config/mail');
const logger = require('../utils/logger');

const TEMPLATE_PATH = path.join(__dirname, '../templates/ticketEmail.html');

const renderTicketEmail = ({ attendeeName, event, ticket }) => {
  let html = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
  const replacements = {
    attendeeName,
    eventTitle: event.title,
    eventDate: new Date(event.date).toDateString(),
    eventTime: event.time,
    eventVenue: event.venue,
    quantity: ticket.quantity,
    totalAmount: ticket.totalAmount,
    ticketId: ticket.ticketId,
  };
  Object.entries(replacements).forEach(([key, value]) => {
    html = html.replaceAll(`{{${key}}}`, value);
  });
  return html;
};

// Sends the QR ticket as both an inline embedded image and a PNG attachment.
const sendTicketEmail = async ({ to, attendeeName, event, ticket }) => {
  const transporter = getTransporter();
  const qrBase64 = ticket.qrCode.split(',')[1]; // strip data:image/png;base64,

  const mailOptions = {
    from: `"EventTicket System" <${process.env.EMAIL_USER}>`,
    to,
    subject: `🎟 Your Ticket for ${event.title}`,
    html: renderTicketEmail({ attendeeName, event, ticket }),
    attachments: [
      {
        filename: 'ticket-qr.png',
        content: qrBase64,
        encoding: 'base64',
        cid: 'qrcode',
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Ticket email sent to ${to} for ticket ${ticket.ticketId}`);
  } catch (err) {
    logger.error('Ticket email failed:', err.message);
    throw err;
  }
};

module.exports = { sendTicketEmail };
