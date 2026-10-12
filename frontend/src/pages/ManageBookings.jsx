import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllBookings } from '../services/bookingService';
import { listEvents } from '../services/eventService';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import QRCodeCard from '../components/QRCodeCard';
import { formatCurrency, formatShortDate, statusColor } from '../utils/formatters';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ eventId: '', status: '' });
  const [selectedQR, setSelectedQR] = useState(null);

  useEffect(() => {
    listEvents().then(({ data }) => setEvents(data.events));
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBookings = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await getAllBookings(params);
      setBookings(data.bookings);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    const params = {};
    if (filter.eventId) params.eventId = filter.eventId;
    if (filter.status) params.status = filter.status;
    fetchBookings(params);
  };

  return (
    <div>
      <h2 className="page-title fw-bold mb-4">All Bookings</h2>

      {/* Filters */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
        <div className="row g-2 align-items-end">
          <div className="col-md-4">
            <label className="form-label small fw-semibold">Filter by Event</label>
            <select
              className="form-select"
              value={filter.eventId}
              onChange={(e) => setFilter({ ...filter, eventId: e.target.value })}
            >
              <option value="">All Events</option>
              {events.map((ev) => <option key={ev._id} value={ev._id}>{ev.title}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-semibold">Filter by Status</label>
            <select
              className="form-select"
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            >
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
            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => { setFilter({ eventId: '', status: '' }); fetchBookings(); }}
            >
              Reset
            </button>
          </div>
          <div className="col-md-2 text-end">
            <span className="badge bg-secondary fs-6">{bookings.length} records</span>
          </div>
        </div>
      </div>

      {selectedQR && (
        <Modal title="Ticket QR Code" onClose={() => setSelectedQR(null)}>
          <QRCodeCard
            qrCode={selectedQR.qrCode}
            ticketId={selectedQR.ticketId}
            subtitle={selectedQR.attendeeName}
            size={220}
          />
          <p className="text-muted small mt-2 mb-0">{selectedQR.attendeeEmail}</p>
        </Modal>
      )}

      {loading ? (
        <Loader />
      ) : (
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
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td><code className="small text-primary">{b.ticketId}</code></td>
                    <td>
                      <div className="fw-semibold small">{b.user?.name}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{b.user?.email}</div>
                    </td>
                    <td className="small">{b.event?.title}</td>
                    <td className="text-center">{b.quantity}</td>
                    <td className="fw-semibold">{formatCurrency(b.totalAmount)}</td>
                    <td><span className={`badge bg-${statusColor(b.status)} text-capitalize`}>{b.status}</span></td>
                    <td className="text-muted small">{formatShortDate(b.createdAt)}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedQR(b)}>
                        👁 QR
                      </button>
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

export default ManageBookings;
