import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { getEvent } from '../services/eventService';
import { bookTicket } from '../services/bookingService';
import BookingForm from '../components/BookingForm';
import Loader from '../components/Loader';
import { categoryEmoji, formatDate } from '../utils/formatters';

const EventDetails = () => {
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

  const emoji = categoryEmoji(event.category);

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* Event Info */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div
              style={{
                background: 'linear-gradient(135deg,#667eea,#764ba2)',
                height: '250px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
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
                  { icon: '📅', label: 'Date', value: formatDate(event.date) },
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
          <BookingForm event={event} user={user} onBook={handleBook} booking={booking} />
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
