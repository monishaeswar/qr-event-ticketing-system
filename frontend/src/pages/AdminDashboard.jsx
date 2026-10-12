import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../services/bookingService';
import Loader from '../components/Loader';
import { formatCurrency, formatShortDate, statusColor } from '../utils/formatters';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(({ data }) => {
        setStats(data.stats);
        setRecentTickets(data.recentTickets);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const statCards = [
    { label: 'Total Events', value: stats.totalEvents, icon: '🎪', cls: 'bg-events' },
    { label: 'Total Bookings', value: stats.totalTickets, icon: '🎫', cls: 'bg-bookings' },
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: '💰', cls: 'bg-revenue' },
    { label: 'Checked In', value: stats.checkedIn, icon: '✅', cls: 'bg-checkins' },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title fw-bold mb-0">Admin Dashboard</h2>
        <div className="d-flex gap-2">
          <Link to="/admin/events/new" className="btn btn-primary btn-sm">+ Add Event</Link>
          <Link to="/admin/scanner" className="btn btn-success btn-sm">📷 QR Scanner</Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {statCards.map((s, i) => (
          <div className="col-sm-6 col-lg-3" key={i}>
            <div className={`card stat-card p-4 ${s.cls}`}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 opacity-75 small">{s.label}</p>
                  <h3 className="fw-bold mb-0">{s.value}</h3>
                </div>
                <span style={{ fontSize: '2.5rem' }}>{s.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Manage Events', icon: '🎪', to: '/admin/events', desc: 'Create, edit, delete events' },
          { label: 'All Bookings', icon: '📋', to: '/admin/bookings', desc: 'View all ticket bookings' },
          { label: 'QR Check-In', icon: '📷', to: '/admin/scanner', desc: 'Scan tickets at the venue' },
        ].map((l, i) => (
          <div className="col-md-4" key={i}>
            <Link to={l.to} className="text-decoration-none">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 hover-shadow">
                <div style={{ fontSize: '2.5rem' }}>{l.icon}</div>
                <h5 className="fw-bold mt-2 mb-1">{l.label}</h5>
                <p className="text-muted small mb-0">{l.desc}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-white border-0 pt-3 pb-0">
          <h5 className="fw-bold">Recent Bookings</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Ticket ID</th>
                  <th>Attendee</th>
                  <th>Event</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTickets.map((t) => (
                  <tr key={t._id}>
                    <td><code className="small">{t.ticketId}</code></td>
                    <td>{t.user?.name}</td>
                    <td>{t.event?.title}</td>
                    <td>{formatCurrency(t.totalAmount)}</td>
                    <td>
                      <span className={`badge bg-${statusColor(t.status)}`}>{t.status}</span>
                    </td>
                    <td className="text-muted small">{formatShortDate(t.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
