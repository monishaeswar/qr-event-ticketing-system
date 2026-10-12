import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container text-center py-5">
    <div style={{ fontSize: '5rem' }}>🎭</div>
    <h1 className="fw-bold display-5 mt-3">404</h1>
    <p className="text-muted mb-4">This page doesn't exist, or the curtain's already down.</p>
    <Link to="/" className="btn btn-primary px-4">Back to Home</Link>
  </div>
);

export default NotFound;
