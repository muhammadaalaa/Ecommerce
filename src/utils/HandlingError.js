export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = `${statusCode}`.startsWith(4) ? "Fail" : "Error";
    this.isOperational = true;
  }
}

export const RoutingHandler = (req, res, next) => {
  const err = new AppError(`invalid URL in ${req.originalUrl}`, 404);
  next(err);
};
export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    fn(req, res, next).catch((err) => {
      next(err);
    });
  };
};
export const globalErrorHandling = (err, req, res, next) => {
  if (process.env.MODE == "dev") {
    development(err, res);
  } else {
    production(err, res);
  }
  next()
};

const development = (err, res) => {
  return res.status(err.statusCode || 500).json({
    success: false,
    error: err,
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const production = (err, res) => {
  return res.status(err.statusCode || 500).json({
    success: false,
    status: err.status,
    message: err.message,
  });
};
