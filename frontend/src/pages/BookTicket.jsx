import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { getEvent } from '../services/eventService';
import { bookTicket } from '../services/bookingService';
import BookingForm from '../components/BookingForm';
import Loader from '../components/Loader';
import { categoryEmoji } from '../utils/formatters';

// A focused, distraction-free alternative to booking inline from
// EventDetails - useful when linking directly to checkout (e.g. from an
// email reminder or a "buy now" button elsewhere in the app).
const BookTicket = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    getEvent(id)
      .then(({ data }) => setEvent(data.event))
      .catch(() => toast.error('Event not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (quantity) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setBooking(true);
    try {
      await bookTicket(id, quantity);
      toast.success('🎉 Ticket booked! Check your email for QR code.');
      navigate('/my-tickets');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <Loader />;
  if (!event) return <div className="text-center py-5"><h4>Event not found</h4></div>;

  return (
    <div className="container py-5" style={{ maxWidth: 640 }}>
      <Link to={`/events/${id}`} className="text-muted small d-inline-block mb-3">
        ← Back to event details
      </Link>
      <div className="text-center mb-4">
        <div style={{ fontSize: '3rem' }}>{categoryEmoji(event.category)}</div>
        <h3 className="fw-bold mb-0">{event.title}</h3>
        <p className="text-muted">Complete your booking below</p>
      </div>
      <BookingForm event={event} user={user} onBook={handleBook} booking={booking} />
    </div>
  );
};

export default BookTicket;
