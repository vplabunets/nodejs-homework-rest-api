const mongoose = require("mongoose");

const schema = mongoose.Schema({
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  contacts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      rel: "contact",
    },
  ],
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
  token: String,
  avatarURL: String,
});

const User = mongoose.model("user", schema);

module.exports = { User };
