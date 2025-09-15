const asyncHandler = require("express-async-handler");

const User = require("../models/user.model");
const { sendSuccessResponse } = require("../utils/responseHandler");

const getUserPoints = asyncHandler(async (req, res) => {
  const userPoints = (await User.findById(req.user._id)).points || 0;

  sendSuccessResponse(res, { userPoints }, 200);
});

module.exports = {
  getUserPoints,
};
