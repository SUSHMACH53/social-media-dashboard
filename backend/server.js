const express = require("express");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend server is running 🚀");
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