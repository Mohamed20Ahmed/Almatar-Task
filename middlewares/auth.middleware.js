const asyncHandler = require("express-async-handler");

const { jwtVerify } = require("../utils/jwtService");
const User = require("../models/user.model");
const ApiError = require("../utils/apiError");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ApiError(
        "You are not login, Please login to get access this route",
        401
      )
    );
  }

  const decoded = jwtVerify(token);

  const currentUser = await User.findById(decoded._id);

  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401
      )
    );
  }

  req.user = currentUser;
  next();
});

module.exports = { protect };
