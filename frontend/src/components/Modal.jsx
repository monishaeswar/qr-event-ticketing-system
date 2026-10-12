import React from 'react';

const Modal = ({ title, onClose, children }) => (
  <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
    <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
      <div className="modal-content rounded-4">
        <div className="modal-header border-0">
          <h5 className="modal-title fw-bold">{title}</h5>
          <button className="btn-close" onClick={onClose} />
        </div>
        <div className="modal-body text-center pb-4">{children}</div>
      </div>
    </div>
  </div>
);

export default Modal;
