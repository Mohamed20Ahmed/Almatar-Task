const { body } = require("express-validator");

const validatorMiddleware = require("../middlewares/validator.middleware");

const registerValidator = [
  body("name")
    .notEmpty()
    .withMessage("Please enter your name")
    .isString()
    .withMessage("name must be a string"),

  body("email")
    .notEmpty()
    .withMessage("Please enter your email")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Please enter your password")
    .isString()
    .withMessage("password must be a string")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters"),

  validatorMiddleware,
];

const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Please enter your email")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Please enter your password")
    .isString()
    .withMessage("password must be a string"),

  validatorMiddleware,
];

module.exports = {
  registerValidator,
  loginValidator,
};
