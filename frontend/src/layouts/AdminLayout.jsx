import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/events', label: 'Manage Events', icon: '🎪' },
  { to: '/admin/bookings', label: 'All Bookings', icon: '📋' },
  { to: '/admin/scanner', label: 'QR Scanner', icon: '📷' },
];

const AdminLayout = () => (
  <div className="container-fluid">
    <div className="row">
      <div className="col-md-2 admin-sidebar p-3">
        <h6 className="text-white-50 text-uppercase small fw-bold px-2 mb-3">Admin</h6>
        <nav className="nav flex-column">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className="nav-link"
            >
              {link.icon} {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="col-md-10 py-3">
        <Outlet />
      </div>
    </div>
  </div>
);

export default AdminLayout;
