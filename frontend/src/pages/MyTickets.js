import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const statusColors = { booked: 'primary', 'checked-in': 'success', cancelled: 'danger' };

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    axios.get('/api/tickets/my')
      .then(({ data }) => setTickets(data.tickets))
      .catch(() => toast.error('Failed to load tickets'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (ticketId) => {
    if (!window.confirm('Cancel this ticket?')) return;
    try {
      await axios.post(`/api/tickets/cancel/${ticketId}`);
      toast.success('Ticket cancelled');
      setTickets(prev => prev.map(t => t.ticketId === ticketId ? { ...t, status: 'cancelled' } : t));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;

  return (
    <div className="container py-5">
      <h2 className="page-title fw-bold mb-4">My Tickets</h2>

      {tickets.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: '4rem' }}>🎟</div>
          <h4 className="text-muted mt-3">No tickets yet</h4>
          <a href="/events" className="btn btn-primary mt-3">Browse Events</a>
        </div>
      ) : (
        <div className="row g-4">
          {tickets.map(ticket => (
            <div className="col-md-6" key={ticket._id}>
              <div className={`card ticket-card shadow-sm border-0 ${ticket.status}`}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold mb-0">{ticket.event?.title}</h5>
                    <span className={`badge bg-${statusColors[ticket.status]} text-capitalize`}>{ticket.status}</span>
                  </div>
                  <p className="text-muted small mb-1">📅 {ticket.event && new Date(ticket.event.date).toDateString()}</p>
                  <p className="text-muted small mb-1">📍 {ticket.event?.venue}</p>
                  <p className="text-muted small mb-1">🎫 {ticket.quantity} Ticket(s) · ₹{ticket.totalAmount}</p>
                  <p className="text-muted small mb-3">🔖 ID: <code>{ticket.ticketId}</code></p>

                  <div className="d-flex gap-2 flex-wrap">
                    <button className="btn btn-outline-primary btn-sm"
                      onClick={() => setSelectedTicket(selectedTicket?._id === ticket._id ? null : ticket)}>
                      {selectedTicket?._id === ticket._id ? 'Hide QR' : '📱 Show QR'}
                    </button>
                    {ticket.status === 'booked' && (
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleCancel(ticket.ticketId)}>
                        Cancel
                      </button>
                    )}
                  </div>

                  {selectedTicket?._id === ticket._id && ticket.qrCode && (
                    <div className="qr-container text-center mt-3 p-3 bg-light rounded-3">
                      <p className="small text-muted mb-2">Present this QR at the venue</p>
                      <img src={ticket.qrCode} alt="QR Code" width="180" className="rounded" />
                      <p className="small text-muted mt-2">{ticket.ticketId}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;
