const asyncHandler = require("express-async-handler");

const User = require("../models/user.model");
const { hash, compare } = require("../utils/bcryptService");
const { jwtGenerator } = require("../utils/jwtService");
const { sendSuccessResponse } = require("../utils/responseHandler");
const ApiError = require("../utils/apiError");

const createUser = async (data) => {
  const hashedpassword = await hash(data.password);

  const user = await User.create({ ...data, password: hashedpassword });

  const token = await jwtGenerator({
    email: user.email,
    _id: user._id,
  });

  return token;
};

const register = asyncHandler(async (req, res, next) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  await uniqueFieldsExistence({
    email: user.email,
  });

  const token = await createUser(user);

  const response = { token, message: "User created successfully" };

  sendSuccessResponse(res, response, 201);
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await compare(password, user.password))) {
    return next(new ApiError("Incorrect email or password", 400));
  }

  const token = await jwtGenerator({
    email: user.email,
    _id: user._id,
  });

  sendSuccessResponse(res, { token }, 200);
});

const uniqueFieldsExistence = async (fields) => {
  if (fields.email) {
    const emailExistence = await User.findOne({ email: fields.email });

    // check if email not exists in database
    if (emailExistence) {
      throw new ApiError("email already exists", 400);
    }
  }
};

module.exports = {
  register,
  login,
};
