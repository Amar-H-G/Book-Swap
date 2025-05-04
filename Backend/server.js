const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const connectDB = require("./DB/db");
// Serve static files (uploaded images) from 'uploads' folder
const fs = require("fs");
const path = require("path");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

app.use("/uploads", express.static("uploads")); // Serve static files

// Routes
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const userRoutes = require("./routes/profile");

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

module.exports = { app };
