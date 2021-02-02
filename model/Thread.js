const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema({
  name: String,
  image: [
    {
      type: String,
      require: true,
    },
  ],
  dateBought: String,
  faultDescription: String,
  description: String,
  createdDate: Date,
  modifiedDate: Date,
  status: {
    type: Boolean,
    default: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  hide: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Thread", threadSchema);
