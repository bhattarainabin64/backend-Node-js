const jwt = require("jsonwebtoken");
const User = require("../models/User");
const customErrorHandler = require("../middlewares/errorHandler");
const asyncHandler = require("./catchAsyncError");

exports.authenticateUser = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith("Bearer")) {
    const token = authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findById(decoded.id).select("-password");
      

      if (!req.user) {
        return next(new customErrorHandler("User not found", 404));
      }

      return next();
    } catch (err) {
      return next(err);
    }
  }
  return next(
    new customErrorHandler("Unauthorized access, please log in", 401)
  );
});

exports.autherorizeRoleAdmin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new customErrorHandler(
        `Role:${req.user.role} is not allowed this resource`,
        403
      );
    }
    next();
  };
};
