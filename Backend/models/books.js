// models/Book.js
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "unavailable"],
    default: "available",
  },
  image: {
    type: String, // URL or file path to the image
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Book", bookSchema);
