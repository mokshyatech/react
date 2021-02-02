const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  otp: String,
});
module.exports = mongoose.model("Otp", otpSchema);
