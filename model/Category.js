const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    lowercase: true,
  },
  imageUrl: String,
  createdDate: Date,
  modifiedDate: Date,
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  active: {
    type: Boolean,
    default: true,
  },
  threads: [
    {
      threadId: {
        type: mongoose.Types.ObjectId,
        ref: "Thread",
      },
    },
  ],
});

module.exports = mongoose.model("Category", categorySchema);
