const express = require("express");
const router = express.Router();
const Book = require("../models/books");
const User = require("../models/user");
const upload = require("../middlewares/upload");

// GET all books (with optional owner info)
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().lean();

    const booksWithOwners = await Promise.all(
      books.map(async (book) => {
        let owner = {};
        try {
          owner = await User.findById(book.ownerId).lean();
        } catch (err) {
          // owner remains empty
        }

        return {
          ...book,
          ownerName: owner?.name,
          ownerEmail: owner?.email,
          ownerMobile: owner?.mobile,
        };
      })
    );

    res.json(booksWithOwners);
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

// POST add a new book
router.post("/", upload.single("image"), async (req, res) => {
  const { title, author, genre, location, ownerId } = req.body;
  const image = req.file ? req.file.path : ""; // Save the image path

  if (!title || !author || !ownerId || !location) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    const newBook = new Book({
      title,
      author,
      genre: genre || "",
      location,
      ownerId,
      image, // Add the image path
    });

    const savedBook = await newBook.save();
    res.status(201).json({ success: true, book: savedBook });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error saving book",
      error: err.message,
    });
  }
});

// PUT: Update book details
router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { title, author, genre, location } = req.body;
  const image = req.file ? req.file.path : ""; // Add the image path if available

  if (!title || !author || !location) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, genre, location, image },
      { new: true }
    );

    if (!updatedBook) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    res.json({ success: true, book: updatedBook });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

// PATCH update book status
router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["available", "unavailable"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedBook) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    res.json({ success: true, book: updatedBook });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

// DELETE a book
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { ownerId } = req.body;

  try {
    const book = await Book.findOne({ _id: id, ownerId });

    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found or unauthorized" });
    }

    await Book.deleteOne({ _id: id });
    res.json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;
