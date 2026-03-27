const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const Post = require("./models/Post");
const app = express();
const PORT = 5000;

// Middleware
mongoose.connect("mongodb+srv://sushmach33_db_user:CoRIzsF2xfHwiuQW@cluster0.t8e5xs8.mongodb.net/")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.error(err));
app.use(express.json());
app.use(cors());
// Test route
app.get("/", (req, res) => {
  res.send("Backend server is running 🚀");
});

app.get("/api/dashboard", (req, res) => {
  res.json({
    followers: 1204,
    posts: 86,
    engagement: "3.4%",
    reach: "12.3k"
  });
});
// Temporary in-memory storage
let posts = [
  {
    id: 1,
    title: "First post",
    content: "Hello from backend"
  }
];
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});


// DELETE post
app.delete("/api/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);

  posts = posts.filter((post) => post.id !== id);

  res.json({ message: "Post deleted successfully" });
});

// POST new post
app.post("/api/posts", (req, res) => {
  const { title, content } = req.body;

  const newPost = {
    id: posts.length + 1,
    title,
    content
  };

  posts.push(newPost);

  res.json(newPost);
});
// Sample API route
app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working successfully",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

