const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    toUser: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      min: [1, "amount of points must be above or equal 1"],
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "expired"],
      default: "pending",
    },

    transactionExpires: Date,
  },
  { timestamps: true }
);

transactionSchema.pre(/^find/, function (next) {
  this.populate({ path: "fromUser", select: "email name" }).populate({
    path: "toUser",
    select: "email name",
  });

  next();
});

module.exports = mongoose.model("Transaction", transactionSchema);
