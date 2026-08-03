function errorHandler(err, req, res, next) {
  const message = err && err.message ? err.message : 'Internal Server Error';

  let statusCode = 500;

  if (message === 'Seat unavailable' || message === 'Duplicate cancellation') {
    statusCode = 409;
  }

  if (message === 'Hold expired' || message === 'Booking not found' || message === 'Seat not found') {
    statusCode = 404;
  }

  if (err && Number.isInteger(err.statusCode)) {
    statusCode = err.statusCode;
  }

  res.status(statusCode).json({
    message,
  });
}

module.exports = errorHandler;