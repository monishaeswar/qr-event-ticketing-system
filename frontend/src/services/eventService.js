import api from './api';

export const listEvents = (params = {}) => api.get('/api/events', { params });

export const getEvent = (id) => api.get(`/api/events/${id}`);

export const createEvent = (payload) => api.post('/api/events', payload);

export const updateEvent = (id, payload) => api.put(`/api/events/${id}`, payload);

export const deleteEvent = (id) => api.delete(`/api/events/${id}`);
