const generateTicketPDF = require('../utils/generatePDF');

// Thin wrapper so controllers depend on the service layer, not the raw
// pdfkit util directly - keeps room to add caching/storage later.
const buildTicketPDF = async ({ event, ticket }) => generateTicketPDF({ event, ticket });

module.exports = { buildTicketPDF };
