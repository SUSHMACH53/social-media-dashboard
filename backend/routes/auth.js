const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/user");
const { users, createId } = require("../utils/memoryStore");

const router = express.Router();

// -------------------- SIGNUP --------------------
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email, and password are required",
      });
    }

    const isDatabaseReady = mongoose.connection.readyState === 1;
    const existingUser = isDatabaseReady
      ? await User.findOne({ email })
      : users.find((user) => user.email === email);

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      _id: createId(),
      name,
      email,
      password: hashedPassword,
      bio: "Social media strategist building a consistent content engine.",
      avatarUrl: "",
      followers: 1240,
      postsCount: 0,
    };

    if (isDatabaseReady) {
      await User.create({
        name,
        email,
        password: hashedPassword,
        bio: newUser.bio,
        avatarUrl: newUser.avatarUrl,
      });
    } else {
      users.push(newUser);
    }

    res.status(201).json({
      message: "User registered successfully",
    });

  } catch (error) {
    res.status(500).json({
      error: "Signup failed",
    });
  }
});

// -------------------- LOGIN --------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const isDatabaseReady = mongoose.connection.readyState === 1;
    const user = isDatabaseReady
      ? await User.findOne({ email })
      : users.find((storedUser) => storedUser.email === email);

    if (!user) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET || "development_secret_key",
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
      },
    });

  } catch (error) {
    res.status(500).json({
      error: "Login failed",
    });
  }
});

module.exports = router;
