// Middleware to handle 404 Not Found errors
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found: ${req.method} - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(
    `[Error]: ${statusCode} - ${req.method} ${req.originalUrl} - ${message}`,
  );

  if (statusCode === 500) {
    console.error(err.stack);
  }

  return res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message,
    timeStamp: new Date().toISOString(),
  });
};
