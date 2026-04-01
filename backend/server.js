require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const Post = require("./models/Post");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB  Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.error(err));

// Test route
app.get("/", (req, res) => {
  res.send("Backend server is running 🚀");
});

// Dashboard API
app.get("/api/dashboard", async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments();

    res.json({
      followers: 1204,
      posts: totalPosts, 
      engagement: "3.4%",
      reach: "12.3k",
      weeklyEngagement: [30, 45, 60, 50, 70, 90, 75]
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
});

// GET all posts
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// POST new post
app.post("/api/posts", async (req, res) => {
  try {
    const { title, content } = req.body;

    const newPost = new Post({ title, content });
    const savedPost = await newPost.save();

    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
});
// UPDATE post
app.put("/api/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to update post" });
  }
});

// DELETE post
app.delete("/api/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Post.findByIdAndDelete(id);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

app.get("/api/create-test-post", async (req, res) => {
  try {
    const newPost = new Post({
      title: "First Post",
      content: "This is a test post from backend"
    });

    await newPost.save();

    res.json({ message: "Test post created" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
});
// Test API
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working successfully" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});