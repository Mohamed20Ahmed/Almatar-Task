const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const Transaction = require("../models/transaction.model");
const User = require("../models/user.model");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const { sendSuccessResponse } = require("../utils/responseHandler");

const getUserTransactions = asyncHandler(async (req, res, next) => {
  const documentsCounts = await Transaction.find({
    fromUser: req.user._id,
  }).countDocuments();

  const apiFeatures = new ApiFeatures(Transaction.find(), {
    fromUser: req.user._id,
    page: req.query.page,
    limit: req.query.limit,
  })
    .paginate(documentsCounts)
    .filter()
    .limitFields()
    .sort();

  const { mongooseQuery, paginationResult } = apiFeatures;

  const transactions = await mongooseQuery;

  const response = { paginationResult, transactions };

  sendSuccessResponse(res, response, 200);
});

const createTransfer = asyncHandler(async (req, res, next) => {
  const fromUser = req.user;
  const { senderEmail, amount } = req.body;

  if (fromUser.email === senderEmail) {
    return next(
      new ApiError("You cannot transfer points to your own account", 400)
    );
  }

  const toUser = await User.findOne({ email: senderEmail });

  if (!toUser) {
    return next(new ApiError("No user found with the provided email", 404));
  }

  const userPoints = (await User.findById(fromUser._id))?.points || 0;

  if (userPoints < amount) {
    return next(
      new ApiError("you don't have sufficient points to send it amount", 400)
    );
  }

  // reset code expiration
  const tenMinutes = 10 * 60 * 1000;

  const transaction = await Transaction.create({
    fromUser: fromUser._id,
    toUser: toUser._id,
    amount,
    transactionExpires: Date.now() + tenMinutes,
  });

  const response = {
    message: `you should confirm transcation with id: ${transaction._id} before 10 mins`,
  };

  sendSuccessResponse(res, response, 200);
});

const confirmTransfer = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const { transactionId } = req.params;

  const transaction = await Transaction.findOne({
    _id: transactionId,
    fromUser: user._id,
    transactionExpires: { $gt: Date.now() },
    status: "pending",
  });

  if (!transaction) {
    return next(new ApiError("Invalid or expired transaction", 400));
  }

  const amount = transaction.amount;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const fromUser = await User.findOneAndUpdate(
      { _id: transaction.fromUser, points: { $gte: amount } },
      { $inc: { points: -amount } },
      { session, new: true }
    );

    if (!fromUser) throw new Error("Insufficient points");

    await User.findByIdAndUpdate(
      transaction.toUser,
      { $inc: { points: amount } },
      { session }
    );

    await Transaction.findByIdAndUpdate(
      transaction._id,
      { status: "confirmed" },
      { session }
    );

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    return next(err);
  } finally {
    session.endSession();
  }

  sendSuccessResponse(
    res,
    { message: "Transaction confirmed successfully" },
    200
  );
});

const expireOldTransactions = async () => {
  const result = await Transaction.updateMany(
    {
      status: "pending",
      transactionExpires: { $lt: Date.now() },
    },
    { $set: { status: "expired" } }
  );

  console.log(`Expired ${result.modifiedCount} transactions`);
};

setInterval(expireOldTransactions, 60 * 1000);

module.exports = {
  getUserTransactions,
  createTransfer,
  confirmTransfer,
};
