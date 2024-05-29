const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  roomId: String,
  userId: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
  username: String,
});

module.exports = mongoose.model("Message", messageSchema);
