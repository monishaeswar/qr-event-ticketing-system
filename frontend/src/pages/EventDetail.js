import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    axios.get(`/api/events/${id}`)
      .then(({ data }) => setEvent(data.event))
      .catch(() => toast.error('Event not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    if (!user) { navigate('/login'); return; }
    setBooking(true);
    try {
      const { data } = await axios.post('/api/tickets/book', { eventId: id, quantity });
      toast.success('🎉 Ticket booked! Check your email for QR code.');
      navigate('/my-tickets');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;
  if (!event) return <div className="text-center py-5"><h4>Event not found</h4></div>;

  const emoji = event.category === 'Concert' ? '🎵' : event.category === 'Conference' ? '💼' : event.category === 'Sports' ? '⚽' : '🎪';

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* Event Info */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="text-center text-white">
                <div style={{ fontSize: '5rem' }}>{emoji}</div>
                <span className="badge bg-light text-dark mt-2">{event.category}</span>
              </div>
            </div>
            <div className="card-body p-4">
              <h2 className="fw-bold">{event.title}</h2>
              <p className="text-muted">{event.description}</p>
              <hr />
              <div className="row g-3">
                {[
                  { icon: '📅', label: 'Date', value: new Date(event.date).toDateString() },
                  { icon: '⏰', label: 'Time', value: event.time },
                  { icon: '📍', label: 'Venue', value: event.venue },
                  { icon: '🏷', label: 'Category', value: event.category },
                  { icon: '💺', label: 'Available Seats', value: event.availableSeats },
                  { icon: '👥', label: 'Total Seats', value: event.totalSeats },
                ].map((d, i) => (
                  <div className="col-sm-6" key={i}>
                    <div className="d-flex align-items-center gap-2 p-3 bg-light rounded-3">
                      <span style={{ fontSize: '1.5rem' }}>{d.icon}</span>
                      <div>
                        <div className="text-muted small">{d.label}</div>
                        <div className="fw-semibold">{d.value}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Card */}
        <div className="col-md-4">
          <div className="card border-0 shadow rounded-4 p-4 sticky-top" style={{ top: '80px' }}>
            <h4 className="fw-bold mb-3">Book Tickets</h4>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted">Price per ticket</span>
              <span className="fw-bold fs-4 text-primary">₹{event.ticketPrice}</span>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Quantity</label>
              <select className="form-select" value={quantity} onChange={e => setQuantity(Number(e.target.value))}>
                {[...Array(Math.min(10, event.availableSeats))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1} Ticket{i > 0 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div className="bg-light rounded-3 p-3 mb-4">
              <div className="d-flex justify-content-between">
                <span>Subtotal ({quantity} × ₹{event.ticketPrice})</span>
                <span className="fw-bold">₹{quantity * event.ticketPrice}</span>
              </div>
            </div>
            {event.availableSeats > 0 ? (
              <button className="btn btn-primary btn-lg w-100" onClick={handleBook} disabled={booking}>
                {booking ? <><span className="spinner-border spinner-border-sm me-2" />Booking...</> : '🎟 Book Now'}
              </button>
            ) : (
              <button className="btn btn-secondary btn-lg w-100" disabled>Sold Out</button>
            )}
            {!user && (
              <p className="text-center text-muted small mt-2">Please <a href="/login">login</a> to book</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
