const CustomErrorHandler = require("./errorHandler");

module.exports = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your token has expired, please login again";
  }

  switch (statusCode) {
    case 400:
      message = `Bad Request: ${message}`;
      break;
    case 401:
      message = `Unauthorized: ${message}`;
      break;
    case 403:
      message = `Forbidden: ${message}`;
      break;
    case 404:
      message = `Not Found: ${message}`;
      break;
    case 409:
      message = `Conflict: ${message}`;
      break;
    case 500:
      message = `Internal Server Error: ${message}`;
      break;
    default:
      break;
  }

  const customError = new CustomErrorHandler(message, statusCode);
  res.status(customError.statusCode).json({
    success: false,
    message: customError.message,
    statusCode: customError.statusCode,
  });
};
