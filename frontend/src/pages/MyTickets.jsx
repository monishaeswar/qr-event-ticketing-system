import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getMyTickets, cancelTicket } from '../services/bookingService';
import TicketCard from '../components/TicketCard';
import Loader from '../components/Loader';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    getMyTickets()
      .then(({ data }) => setTickets(data.tickets))
      .catch(() => toast.error('Failed to load tickets'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (ticketId) => {
    if (!window.confirm('Cancel this ticket?')) return;
    try {
      await cancelTicket(ticketId);
      toast.success('Ticket cancelled');
      setTickets((prev) =>
        prev.map((t) => (t.ticketId === ticketId ? { ...t, status: 'cancelled' } : t))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    }
  };

  if (loading) return <Loader />;

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
          {tickets.map((ticket) => (
            <div className="col-md-6" key={ticket._id}>
              <TicketCard
                ticket={ticket}
                showQR={expandedId === ticket._id}
                onToggleQR={() => setExpandedId(expandedId === ticket._id ? null : ticket._id)}
                onCancel={() => handleCancel(ticket.ticketId)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;
