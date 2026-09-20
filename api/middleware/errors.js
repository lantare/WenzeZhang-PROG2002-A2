class HttpError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
  }
}

function asyncHandler(handler) {
  return (request, response, next) => {
    Promise.resolve(handler(request, response, next)).catch(next);
  };
}

function notFoundHandler(request, response) {
  response.status(404).json({
    error: {
      code: "ROUTE_NOT_FOUND",
      message: `No route matches ${request.method} ${request.originalUrl}.`,
    },
  });
}

function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    next(error);
    return;
  }

  const status = error.status || 500;
  const code = error.code || "INTERNAL_SERVER_ERROR";
  const message =
    status >= 500 ? "The server could not complete the request." : error.message;

  if (status >= 500) {
    console.error(error);
  }

  response.status(status).json({ error: { code, message } });
}

module.exports = { HttpError, asyncHandler, notFoundHandler, errorHandler };
