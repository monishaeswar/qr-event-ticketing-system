import React from 'react';

const QRCodeCard = ({ qrCode, ticketId, subtitle, size = 180 }) => (
  <div className="qr-container text-center p-3 bg-light rounded-3">
    <p className="small text-muted mb-2">Present this QR at the venue</p>
    <img src={qrCode} alt="QR Code" width={size} className="rounded" />
    {subtitle && <p className="mt-3 mb-1 fw-semibold">{subtitle}</p>}
    <p className="small text-muted mt-2 mb-0">
      <code>{ticketId}</code>
    </p>
  </div>
);

export default QRCodeCard;
