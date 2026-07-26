import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size,
  loading = false,
  loadingText = 'Loading...',
  className = '',
  ...rest
}) => (
  <button
    className={`btn btn-${variant} ${size ? `btn-${size}` : ''} ${className}`}
    disabled={loading || rest.disabled}
    {...rest}
  >
    {loading && <span className="spinner-border spinner-border-sm me-2" />}
    {loading ? loadingText : children}
  </button>
);

export default Button;
