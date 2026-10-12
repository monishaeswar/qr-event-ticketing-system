import React from 'react';
import { Link } from 'react-router-dom';
import { categoryEmoji, formatDate, formatCurrency } from '../utils/formatters';

const EventCard = ({ event, compact = false }) => (
  <div className="card event-card shadow-sm h-100">
    <div
      className="position-relative"
      style={{
        background: 'linear-gradient(135deg,#667eea22,#764ba233)',
        height: compact ? '150px' : '160px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{ fontSize: '4rem' }}>{categoryEmoji(event.category)}</span>
      <span className="badge bg-primary position-absolute top-0 end-0 m-2">{event.category}</span>
    </div>
    <div className="card-body">
      <h5 className="card-title fw-bold">{event.title}</h5>
      {!compact && event.description && (
        <p className="text-muted small">{event.description.substring(0, 80)}...</p>
      )}
      <div className="d-flex flex-column gap-1 mb-2">
        <span className="text-muted small">📅 {formatDate(event.date)}</span>
        <span className="text-muted small">📍 {event.venue}</span>
        {!compact && (
          <span className="text-muted small">💺 {event.availableSeats} seats left</span>
        )}
      </div>
      <div className="d-flex justify-content-between align-items-center mt-2">
        <span className="fw-bold text-primary fs-5">{formatCurrency(event.ticketPrice)}</span>
        {!compact && (
          <span className={`badge ${event.availableSeats > 0 ? 'bg-success' : 'bg-danger'}`}>
            {event.availableSeats > 0 ? 'Available' : 'Sold Out'}
          </span>
        )}
      </div>
    </div>
    <div className="card-footer bg-white border-0 pb-3">
      <Link to={`/events/${event._id}`} className="btn btn-primary w-100">
        {compact ? 'Book Now' : 'View & Book'}
      </Link>
    </div>
  </div>
);

export default EventCard;
