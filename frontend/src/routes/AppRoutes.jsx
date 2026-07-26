import React from 'react';
import { Routes, Route } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Events from '../pages/Events';
import EventDetails from '../pages/EventDetails';
import BookTicket from '../pages/BookTicket';
import MyTickets from '../pages/MyTickets';
import Profile from '../pages/Profile';
import QRScanner from '../pages/QRScanner';
import AdminDashboard from '../pages/AdminDashboard';
import AdminEvents from '../pages/AdminEvents';
import CreateEvent from '../pages/CreateEvent';
import EditEvent from '../pages/EditEvent';
import ManageBookings from '../pages/ManageBookings';
import NotFound from '../pages/NotFound';

const AppRoutes = () => (
  <Routes>
    <Route element={<MainLayout />}>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetails />} />

      {/* Signed-in users */}
      <Route element={<ProtectedRoute />}>
        <Route path="/events/:id/book" element={<BookTicket />} />
        <Route path="/my-tickets" element={<MyTickets />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Admin only */}
      <Route element={<ProtectedRoute adminOnly />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/events/new" element={<CreateEvent />} />
          <Route path="/admin/events/:id/edit" element={<EditEvent />} />
          <Route path="/admin/bookings" element={<ManageBookings />} />
          <Route path="/admin/scanner" element={<QRScanner />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default AppRoutes;
