import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { checkInTicket } from '../services/bookingService';

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [manualInput, setManualInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const scannerRef = useRef(null);
  const html5QrcodeRef = useRef(null);

  const startScanner = async () => {
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      html5QrcodeRef.current = new Html5Qrcode('qr-reader');
      await html5QrcodeRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          stopScanner();
          processCheckIn(decodedText);
        },
        () => {}
      );
      setScanning(true);
    } catch (err) {
      toast.error('Camera not available: ' + err.message);
    }
  };

  const stopScanner = async () => {
    try {
      if (html5QrcodeRef.current) {
        await html5QrcodeRef.current.stop();
        html5QrcodeRef.current = null;
      }
    } catch {}
    setScanning(false);
  };

  useEffect(() => { return () => { stopScanner(); }; }, []);

  const processCheckIn = async (qrData) => {
    setLoading(true);
    setResult(null);
    try {
      const { data } = await checkInTicket(qrData);
      const entry = { ...data, timestamp: new Date(), success: true };
      setResult(entry);
      setHistory(prev => [entry, ...prev.slice(0, 9)]);
      toast.success(data.message);
    } catch (err) {
      const errData = { message: err.response?.data?.message || 'Check-in failed', ticket: err.response?.data?.ticket, timestamp: new Date(), success: false };
      setResult(errData);
      setHistory(prev => [errData, ...prev.slice(0, 9)]);
      toast.error(errData.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheckin = () => {
    if (!manualInput.trim()) { toast.warning('Enter a ticket ID or QR data'); return; }
    // Try as ticket ID directly or as JSON
    let qrData = manualInput.trim();
    try { JSON.parse(qrData); } catch { qrData = JSON.stringify({ ticketId: qrData }); }
    processCheckIn(qrData);
    setManualInput('');
  };

  return (
    <div>
      <h2 className="page-title fw-bold mb-4">📷 QR Check-In Scanner</h2>

      <div className="row g-4">
        {/* Scanner Panel */}
        <div className="col-md-7">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-3">Camera Scanner</h5>

            <div id="qr-reader" className="mb-3" style={{ width: '100%', minHeight: scanning ? '300px' : '0' }} />

            {!scanning ? (
              <button className="btn btn-primary btn-lg w-100 mb-3" onClick={startScanner}>
                📷 Start Camera Scanner
              </button>
            ) : (
              <button className="btn btn-danger btn-lg w-100 mb-3" onClick={stopScanner}>
                ⏹ Stop Scanner
              </button>
            )}

            {scanning && (
              <div className="alert alert-info d-flex align-items-center gap-2 mb-3">
                <div className="spinner-border spinner-border-sm text-info" />
                <span>Scanning for QR codes... Point camera at ticket QR</span>
              </div>
            )}

            {/* Manual Input */}
            <hr />
            <h6 className="fw-semibold mb-2">Manual Entry</h6>
            <p className="text-muted small">Enter Ticket ID (e.g. EVT-XXXXXXXX) for manual check-in</p>
            <div className="input-group">
              <input className="form-control" placeholder="EVT-XXXXXXXX"
                value={manualInput} onChange={e => setManualInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleManualCheckin()} />
              <button className="btn btn-success" onClick={handleManualCheckin} disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm" /> : 'Check In'}
              </button>
            </div>
          </div>
        </div>

        {/* Result Panel */}
        <div className="col-md-5">
          {/* Latest Result */}
          {result && (
            <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 border-start border-4 border-${result.success ? 'success' : 'danger'}`}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <span style={{ fontSize: '2rem' }}>{result.success ? '✅' : '❌'}</span>
                <h5 className="fw-bold mb-0">{result.message}</h5>
              </div>
              {result.ticket && (
                <div className="bg-light rounded-3 p-3">
                  <p className="mb-1 fw-semibold">{result.ticket.event?.title || 'Event'}</p>
                  <p className="mb-1 text-muted small">👤 {result.ticket.attendeeName || result.ticket.user?.name}</p>
                  <p className="mb-1 text-muted small">📧 {result.ticket.attendeeEmail || result.ticket.user?.email}</p>
                  <p className="mb-1 text-muted small">🎫 {result.ticket.quantity} ticket(s)</p>
                  <p className="mb-0 text-muted small">🔖 {result.ticket.ticketId}</p>
                  {result.checkedInAt && (
                    <p className="mb-0 text-danger small mt-1">⚠️ Already checked in: {new Date(result.checkedInAt).toLocaleTimeString()}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Scan History */}
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h6 className="fw-bold mb-3">Recent Scans</h6>
            {history.length === 0 ? (
              <p className="text-muted small text-center py-3">No scans yet</p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {history.map((h, i) => (
                  <div key={i} className={`d-flex justify-content-between align-items-center p-2 rounded-3 ${h.success ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'}`}>
                    <div>
                      <span style={{ fontSize: '1rem' }}>{h.success ? '✅' : '❌'}</span>
                      <span className="ms-2 small fw-semibold">{h.ticket?.ticketId || 'Unknown'}</span>
                    </div>
                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>{h.timestamp.toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
