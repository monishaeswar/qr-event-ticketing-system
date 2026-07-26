import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import Button from './Button';

const BookingForm = ({ event, user, onBook, booking }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="card border-0 shadow rounded-4 p-4 sticky-top" style={{ top: '80px' }}>
      <h4 className="fw-bold mb-3">Book Tickets</h4>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted">Price per ticket</span>
        <span className="fw-bold fs-4 text-primary">{formatCurrency(event.ticketPrice)}</span>
      </div>
      <div className="mb-3">
        <label className="form-label fw-semibold">Quantity</label>
        <select
          className="form-select"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        >
          {[...Array(Math.min(10, event.availableSeats))].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} Ticket{i > 0 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>
      <div className="bg-light rounded-3 p-3 mb-4">
        <div className="d-flex justify-content-between">
          <span>
            Subtotal ({quantity} × {formatCurrency(event.ticketPrice)})
          </span>
          <span className="fw-bold">{formatCurrency(quantity * event.ticketPrice)}</span>
        </div>
      </div>
      {event.availableSeats > 0 ? (
        <Button
          size="lg"
          className="w-100"
          loading={booking}
          loadingText="Booking..."
          onClick={() => onBook(quantity)}
        >
          🎟 Book Now
        </Button>
      ) : (
        <button className="btn btn-secondary btn-lg w-100" disabled>
          Sold Out
        </button>
      )}
      {!user && (
        <p className="text-center text-muted small mt-2">
          Please <a href="/login">login</a> to book
        </p>
      )}
    </div>
  );
};

export default BookingForm;
