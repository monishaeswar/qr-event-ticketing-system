import React from 'react';

// size: 'sm' | 'lg'. Used in place of the `<div className="spinner-border" />`
// markup that used to be duplicated across most pages.
const Loader = ({ size = 'lg', className = '' }) => (
  <div className={`text-center py-5 ${className}`}>
    <div
      className="spinner-border text-primary"
      style={size === 'lg' ? { width: '3rem', height: '3rem' } : undefined}
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export default Loader;
