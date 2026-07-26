import api from './api';

// Legacy single-step booking flow (still the one the UI uses).
export const bookTicket = (eventId, quantity) => api.post('/api/tickets/book', { eventId, quantity });

export const getMyTickets = () => api.get('/api/tickets/my');

export const getTicketById = (ticketId) => api.get(`/api/tickets/${ticketId}`);

export const cancelTicket = (ticketId) => api.post(`/api/tickets/cancel/${ticketId}`);

// Newer Booking + Payment flow (see backend bookingController) - available
// for when the UI wants to show a payment step instead of instant booking.
export const createBooking = (eventId, quantity) => api.post('/api/bookings', { eventId, quantity });

export const getMyBookings = () => api.get('/api/bookings/my');

export const getBookingById = (id) => api.get(`/api/bookings/${id}`);

// Admin QR check-in.
export const checkInTicket = (qrData) => api.post('/api/admin/checkin', { qrData });

export const getAllBookings = (params = {}) => api.get('/api/admin/bookings', { params });

export const getDashboardStats = () => api.get('/api/admin/dashboard');
