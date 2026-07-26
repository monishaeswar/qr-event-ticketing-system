import api from './api';

// Read-only lookups against the Payment records created by the new
// /api/bookings flow (see backend/controllers/paymentController.js).
export const getMyPayments = () => api.get('/api/payments/my');

export const getPaymentById = (id) => api.get(`/api/payments/${id}`);
