const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
  let status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Something went wrong on the server.';

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  } else if (err.name === 'CastError') {
    status = 404;
    message = 'Resource not found';
  } else if (err.code === 11000) {
    status = 400;
    message = 'This email is already registered';
  }

  if (status === 500) {
    console.error(err);
    message = 'Something went wrong on the server.';
  }
  res.status(status).json({ success: false, message });
};

module.exports = { notFound, errorHandler };
