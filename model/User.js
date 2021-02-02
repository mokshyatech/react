const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  dateOfBirth: String,
  gender: String,
  accountStatus: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
  },
  password: String,
  photo: String,
  createdAt: Date,
  modifiedAt: Date,
  name: String,
  workAt: String,
  aboutMe: String,
  phoneNo: String,
  city: String,
  country: String,
  user: {
    ref: "User",
    type: mongoose.Types.ObjectId,
  },
  verified: {
    default: false,
    type: Boolean,
  },
  deactivated: {
    default: false,
    type: Boolean,
  },
  deleted: {
    default: false,
    type: Boolean,
  },

  followers: [
    {
      // type: String,
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  blocked: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
