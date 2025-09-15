const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name required"],
    },

    email: {
      type: String,
      required: [true, "email required"],
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "password required"],
      minlength: [6, "Too short password"],
    },

    points: { type: Number, default: 500 },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
