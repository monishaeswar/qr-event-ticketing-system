import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';

// Used as a layout route: <Route element={<ProtectedRoute adminOnly />}> ... </Route>
// Renders <Outlet /> for its children once the auth check passes, or
// redirects otherwise.
const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
