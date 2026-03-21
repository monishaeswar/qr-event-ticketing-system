import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ eventId: '', status: '' });
  const [selectedQR, setSelectedQR] = useState(null);

  useEffect(() => {
    axios.get('/api/events').then(({ data }) => setEvents(data.events));
    fetchBookings();
  }, []);

  const fetchBookings = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/admin/bookings', { params });
      setBookings(data.bookings);
    } catch { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  };

  const handleFilter = () => {
    const params = {};
    if (filter.eventId) params.eventId = filter.eventId;
    if (filter.status) params.status = filter.status;
    fetchBookings(params);
  };

  const statusBadge = (status) => ({
    booked: 'primary', 'checked-in': 'success', cancelled: 'danger'
  }[status] || 'secondary');

  return (
    <div className="container py-5">
      <h2 className="page-title fw-bold mb-4">All Bookings</h2>

      {/* Filters */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
        <div className="row g-2 align-items-end">
          <div className="col-md-4">
            <label className="form-label small fw-semibold">Filter by Event</label>
            <select className="form-select" value={filter.eventId} onChange={e => setFilter({ ...filter, eventId: e.target.value })}>
              <option value="">All Events</option>
              {events.map(ev => <option key={ev._id} value={ev._id}>{ev.title}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-semibold">Filter by Status</label>
            <select className="form-select" value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}>
              <option value="">All Statuses</option>
              <option value="booked">Booked</option>
              <option value="checked-in">Checked In</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100" onClick={handleFilter}>Apply</button>
          </div>
          <div className="col-md-1">
            <button className="btn btn-outline-secondary w-100" onClick={() => { setFilter({ eventId: '', status: '' }); fetchBookings(); }}>Reset</button>
          </div>
          <div className="col-md-2 text-end">
            <span className="badge bg-secondary fs-6">{bookings.length} records</span>
          </div>
        </div>
      </div>

      {/* QR Preview Modal */}
      {selectedQR && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setSelectedQR(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content rounded-4">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Ticket QR Code</h5>
                <button className="btn-close" onClick={() => setSelectedQR(null)} />
              </div>
              <div className="modal-body text-center pb-4">
                <img src={selectedQR.qrCode} alt="QR" width="220" className="rounded border border-2 border-primary p-2" />
                <p className="mt-3 mb-1 fw-semibold">{selectedQR.attendeeName}</p>
                <p className="text-muted small">{selectedQR.attendeeEmail}</p>
                <code>{selectedQR.ticketId}</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? <div className="text-center py-5"><div className="spinner-border text-primary" /></div> : (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Ticket ID</th><th>Attendee</th><th>Event</th>
                  <th>Qty</th><th>Amount</th><th>Status</th><th>Booked On</th><th>QR</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b._id}>
                    <td><code className="small text-primary">{b.ticketId}</code></td>
                    <td>
                      <div className="fw-semibold small">{b.user?.name}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{b.user?.email}</div>
                    </td>
                    <td className="small">{b.event?.title}</td>
                    <td className="text-center">{b.quantity}</td>
                    <td className="fw-semibold">₹{b.totalAmount}</td>
                    <td><span className={`badge bg-${statusBadge(b.status)} text-capitalize`}>{b.status}</span></td>
                    <td className="text-muted small">{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedQR(b)}>👁 QR</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
