import api from './api';

export const loginRequest = (email, password) => api.post('/api/auth/login', { email, password });

export const registerRequest = (formData) => api.post('/api/auth/register', formData);

export const fetchCurrentUser = () => api.get('/api/auth/me');

export const getProfile = () => api.get('/api/users/profile');

export const updateProfile = (payload) => api.put('/api/users/profile', payload);

export const changePassword = (payload) => api.put('/api/users/password', payload);
