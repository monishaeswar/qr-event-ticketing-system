import React from 'react';
import QRCodeCard from './QRCodeCard';
import { formatDate, formatCurrency, statusColor } from '../utils/formatters';

const TicketCard = ({ ticket, showQR, onToggleQR, onCancel }) => (
  <div className={`card ticket-card shadow-sm border-0 ${ticket.status}`}>
    <div className="card-body p-4">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <h5 className="fw-bold mb-0">{ticket.event?.title}</h5>
        <span className={`badge bg-${statusColor(ticket.status)} text-capitalize`}>
          {ticket.status}
        </span>
      </div>
      <p className="text-muted small mb-1">
        📅 {ticket.event && formatDate(ticket.event.date)}
      </p>
      <p className="text-muted small mb-1">📍 {ticket.event?.venue}</p>
      <p className="text-muted small mb-1">
        🎫 {ticket.quantity} Ticket(s) · {formatCurrency(ticket.totalAmount)}
      </p>
      <p className="text-muted small mb-3">
        🔖 ID: <code>{ticket.ticketId}</code>
      </p>

      <div className="d-flex gap-2 flex-wrap">
        <button className="btn btn-outline-primary btn-sm" onClick={onToggleQR}>
          {showQR ? 'Hide QR' : '📱 Show QR'}
        </button>
        {ticket.status === 'booked' && (
          <button className="btn btn-outline-danger btn-sm" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>

      {showQR && ticket.qrCode && (
        <div className="mt-3">
          <QRCodeCard qrCode={ticket.qrCode} ticketId={ticket.ticketId} />
        </div>
      )}
    </div>
  </div>
);

export default TicketCard;
