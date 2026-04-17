const axios = require("axios");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const Post = require("./models/Post");
const youtubeRoutes = require("./routes/youtube");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/youtube", youtubeRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.error(err));

// -------------------- TEST ROUTE --------------------
app.get("/", (req, res) => {
  res.send("Backend server is running 🚀");
});

// -------------------- DASHBOARD API --------------------
app.get("/api/dashboard", async (req, res) => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        params: {
          part: "statistics",
          forUsername: "GoogleDevelopers",
          key: apiKey,
        },
      }
    );

    const stats = response.data.items[0].statistics;

    res.json({
      followers: stats.subscriberCount,
      posts: stats.videoCount,
      engagement: "N/A",
      reach: stats.viewCount,
      weeklyEngagement: [30, 45, 60, 50, 70, 90, 75],
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

// -------------------- POSTS API --------------------
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

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

app.delete("/api/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Post.findByIdAndDelete(id);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});
// -------------------- ANALYTICS API --------------------
app.get("/api/analytics", async (req, res) => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;

    // STEP 1: Get channel uploads playlist
    const channelRes = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        params: {
          part: "contentDetails",
          forUsername: "GoogleDevelopers",
          key: apiKey,
        },
      }
    );

    const uploadsPlaylistId =
      channelRes.data.items[0].contentDetails.relatedPlaylists.uploads;

    // STEP 2: Fetch videos
    const videosRes = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlistItems",
      {
        params: {
          part: "snippet",
          playlistId: uploadsPlaylistId,
          maxResults: 20,
          key: apiKey,
        },
      }
    );

    const videos = videosRes.data.items;

    // STEP 3: Upload frequency
    const dayCount = {
      Mon: 0, Tue: 0, Wed: 0, Thu: 0,
      Fri: 0, Sat: 0, Sun: 0
    };

    videos.forEach((video) => {
      const date = new Date(video.snippet.publishedAt);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });
      dayCount[day]++;
    });

    const uploadFrequency = Object.values(dayCount);

    // STEP 4: Get video IDs
    const videoIds = videos
      .slice(0, 5)
      .map((video) => video.snippet.resourceId.videoId)
      .join(",");

    // STEP 5: Fetch video stats
    const statsRes = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "statistics",
          id: videoIds,
          key: apiKey,
        },
      }
    );

    // STEP 6: Build performance data
    const postPerformance = videos.slice(0, 5).map((video, index) => ({
      post: `Video ${index + 1}`,
      title: video.snippet.title,
      score: parseInt(statsRes.data.items[index].statistics.viewCount),
    }));

    // BEST VIDEO
    const bestVideo = postPerformance.reduce((max, video) =>
      video.score > max.score ? video : max
    );
    // -------------------- TREND DETECTION --------------------

const topTitles = postPerformance.map((video) =>
  video.title.toLowerCase()
);

let aiCount = 0;
let devCount = 0;
let eduCount = 0;

topTitles.forEach((title) => {
  if (title.includes("ai") || title.includes("gemini")) aiCount++;
  if (title.includes("dev") || title.includes("code") || title.includes("implement")) devCount++;
  if (title.includes("build") || title.includes("tutorial")) eduCount++;
});

// Determine dominant trend
let trendCategory = "General Content";

if (aiCount >= devCount && aiCount >= eduCount) {
  trendCategory = "AI-focused content performs best";
} else if (devCount >= aiCount && devCount >= eduCount) {
  trendCategory = "Developer-focused content performs best";
} else if (eduCount >= aiCount && eduCount >= devCount) {
  trendCategory = "Educational/tutorial content performs best";
}

    // WORST VIDEO
    const worstVideo = postPerformance.reduce((min, video) =>
      video.score < min.score ? video : min
    );

    // -------------------- AI INSIGHTS --------------------

    // Upload Insight
    const maxUploads = Math.max(...uploadFrequency);
    const bestDayIndex = uploadFrequency.indexOf(maxUploads);
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const bestDay = days[bestDayIndex];

    const uploadInsight = `You are most active on ${bestDay}`;

    // Performance Insight
    let performanceRatio = 0;
    let performanceInsight = "Not enough data for comparison";

    if (bestVideo && worstVideo && worstVideo.score > 0) {
      performanceRatio = (bestVideo.score / worstVideo.score).toFixed(1);
      performanceInsight = `Your best video performs ${performanceRatio}x better than your lowest performing video`;
    }

    // Consistency Insight
    const isConsistent = uploadFrequency.every((val) => val >= 3);

    const consistencyInsight = isConsistent
      ? "You have a consistent upload pattern"
      : "Your upload pattern is inconsistent across the week";

    // -------------------- SMART RECOMMENDATIONS --------------------

    const bestDayRecommendation = `You should post more on ${bestDay} to maximize engagement`;

    const weekendUploads = uploadFrequency[5] + uploadFrequency[6];

    const weekendRecommendation =
      weekendUploads < 2
        ? "Weekend activity is low — consider avoiding or experimenting with weekend posts"
        : "You are utilizing weekends well";

    const strategyRecommendation =
      performanceRatio > 5
        ? "Your top content significantly outperforms others — consider creating similar content"
        : "Your content performance is balanced — maintain consistency";

    const consistencyRecommendation = isConsistent
      ? "Keep maintaining your consistent posting schedule"
      : "Try to maintain a more consistent posting schedule throughout the week";
    // -------------------- AUTOMATION (PHASE 3 STEP 1) --------------------

// 1. Next Best Day (already calculated earlier)
const nextBestDay = bestDay;

// 2. Content Suggestion (based on best performing video)
const contentSuggestion = `${trendCategory}. Consider creating similar themed videos`;

// 3. Posting Advice
const weekendUploadsAuto = uploadFrequency[5] + uploadFrequency[6];

const postingAdvice =
  weekendUploadsAuto < 2
    ? "Avoid weekends and focus on mid-week uploads for better performance"
    : "You are utilizing weekends well — maintain your current posting pattern";
// -------------------- ALERT SYSTEM (PHASE 3 STEP 3) --------------------

const alerts = [];

// 1. Consistency Alert
if (!isConsistent) {
  alerts.push("⚠ Your upload consistency is low — try posting more regularly");
}

// 2. High Performance Gap Alert
if (bestVideo && worstVideo && worstVideo.score > 0) {
  const ratio = bestVideo.score / worstVideo.score;

  if (ratio > 5) {
    alerts.push("🔥 Your top video is performing significantly better than others");
  }
}

// 3. Low Performing Content Alert
const lowPerformingVideos = postPerformance.filter(
  (video) => video.score < 1500
);

if (lowPerformingVideos.length > 0) {
  alerts.push("📉 Some of your recent videos are underperforming");
}

// 4. Strong Performance Alert (optional positive signal)
if (bestVideo.score > 8000) {
  alerts.push("🚀 You have a high-performing video — capitalize on this trend");
}
    // FINAL RESPONSE
    res.json({
      uploadFrequency,
      postPerformance,
      bestVideo,
      worstVideo,

      insights: {
        uploadInsight,
        performanceInsight,
        consistencyInsight,
      },

      recommendations: {
        bestDayRecommendation,
        weekendRecommendation,
        strategyRecommendation,
        consistencyRecommendation,
      },
        automation: {
        nextBestDay,
        contentSuggestion,
        postingAdvice,
        trendCategory
      },
      alerts
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});
// -------------------- PROFILE API --------------------
let userProfile = {
  name: "John Doe",
  email: "john123@example.com",
  bio: "Social media enthusiast 🚀"
};

app.get("/api/profile", (req, res) => {
  res.json(userProfile);
});

app.put("/api/profile", (req, res) => {
  try {
    const { name, email, bio } = req.body;
    userProfile = { name, email, bio };
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// -------------------- TEST API --------------------
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working successfully" });
});

// -------------------- START SERVER --------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});