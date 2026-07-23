const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
  },
  content: {
    type: String,
    required: true,
  },
});

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: {
      type: String,
      default: "New Chat",
    },

    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);