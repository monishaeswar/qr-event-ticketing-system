const logger = require('../utils/logger');

// 404 handler - place after all routes are mounted.
const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found - ${req.originalUrl}`));
};

// Central error handler - place last, after notFound. Any controller that
// calls next(err) or throws inside an async handler wrapped with a
// try/catch that forwards to next() ends up here.
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Server error';

  // Common Mongoose error shapes get friendlier messages.
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate value entered for a unique field';
  }
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }

  logger.error(`${req.method} ${req.originalUrl} -> ${statusCode}: ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
