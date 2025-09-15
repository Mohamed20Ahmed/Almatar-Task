const { body, param, query } = require("express-validator");

const validatorMiddleware = require("../middlewares/validator.middleware");

const getUserTransactionsValidator = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("limit must be an integer between 1 and 50."),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be an integer starting from 1."),

  validatorMiddleware,
];

const createTransferValidator = [
  body("senderEmail", "senderEmail is is required and must be a valid email")
    .notEmpty()
    .isEmail(),

  body("amount", "amount is required and must be a number greater than 0")
    .notEmpty()
    .isInt({ min: 1 })
    .custom((value) => typeof value === "number"),

  validatorMiddleware,
];

const confirmTransferValidator = [
  param("transactionId")
    .isMongoId()
    .withMessage("Invalid transactionId format"),

  validatorMiddleware,
];

module.exports = {
  getUserTransactionsValidator,
  createTransferValidator,
  confirmTransferValidator,
};
