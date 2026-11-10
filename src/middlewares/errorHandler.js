import ApiError from '../utils/ApiError.js';

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  if (!(err instanceof ApiError)) {
    statusCode = 500;
    message = 'Terjadi kesalahan pada server';
  }

  console.error(`[ERROR] ${statusCode} - ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;