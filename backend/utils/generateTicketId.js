const { v4: uuidv4 } = require('uuid');

// Produces IDs like "EVT-9F3C1A2B" - short, unique enough for a ticket lookup key.
const generateTicketId = () => `EVT-${uuidv4().substring(0, 8).toUpperCase()}`;

module.exports = generateTicketId;
