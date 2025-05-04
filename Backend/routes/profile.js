// routes/profile.js
const express = require("express");
const router = express.Router();
const User = require("../models/user"); // Correct Mongoose model

// GET user profile by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// PATCH - Edit user profile
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile } = req.body;

    // Ensure at least one field is provided for update
    if (!name && !email && !mobile) {
      return res
        .status(400)
        .json({ success: false, message: "No valid fields to update" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update the fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;

    await user.save();

    res.json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
