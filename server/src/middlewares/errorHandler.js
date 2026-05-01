const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack || err);
  } else {
    console.error(err.message);
  }

  return res.status(err.statusCode || 500).json({
    message: err.statusCode ? err.message : "Internal Server Error",
  });
};

export default errorHandler;
