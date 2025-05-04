const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb("Error: Only images are allowed!");
};

// Set limits (optional)
const limits = {
  fileSize: 2 * 1024 * 1024, // 2MB
};

// Final upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits,
});

module.exports = upload;
