const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message;

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors,
    ...(process.env.NODE_ENV === "development" && {stack: err.stack }),
  });
};

export default globalErrorHandler;
