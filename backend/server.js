try {
  require("dotenv").config();
} catch {
  console.warn("dotenv is not installed; using existing environment variables.");
}

const axios = require("axios");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const Post = require("./models/Post");
const User = require("./models/user");
const youtubeRoutes = require("./routes/youtube");
const authRoutes = require("./routes/auth");
const { posts: memoryPosts, users: memoryUsers, createId } = require("./utils/memoryStore");

const app = express();
const PORT = process.env.PORT || 5000;
const DEFAULT_CHANNEL = process.env.YOUTUBE_CHANNEL || "GoogleDevelopers";

app.use(cors());
app.use(express.json());
app.use("/api/youtube", youtubeRoutes);
app.use("/api/auth", authRoutes);

const fallbackVideos = [
  { post: "Post 1", title: "AI workflow tips for creators", score: 9600 },
  { post: "Post 2", title: "Build a better posting calendar", score: 7200 },
  { post: "Post 3", title: "Developer update highlights", score: 5400 },
  { post: "Post 4", title: "Content planning tutorial", score: 4300 },
  { post: "Post 5", title: "Analytics explained simply", score: 3800 },
];

const fallbackUploadFrequency = [3, 5, 4, 6, 8, 2, 1];

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-US", { maximumFractionDigits: 0 });

const isDatabaseReady = () => mongoose.connection.readyState === 1;

const getYouTubeClient = () => {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return null;
  }

  return axios.create({
    baseURL: "https://www.googleapis.com/youtube/v3",
    params: { key: apiKey },
  });
};

const getChannelData = async (part = "snippet,statistics,contentDetails") => {
  const client = getYouTubeClient();

  if (!client) {
    return null;
  }

  const response = await client.get("/channels", {
    params: { part, forUsername: DEFAULT_CHANNEL },
  });

  return response.data.items?.[0] || null;
};

const buildAnalytics = (uploadFrequency, postPerformance) => {
  const safePerformance = postPerformance.length ? postPerformance : fallbackVideos;
  const totalViews = safePerformance.reduce((sum, video) => sum + video.score, 0);
  const averageViews = Math.round(totalViews / safePerformance.length);
  const bestVideo = safePerformance.reduce((max, video) =>
    video.score > max.score ? video : max
  );
  const worstVideo = safePerformance.reduce((min, video) =>
    video.score < min.score ? video : min
  );

  const maxUploads = Math.max(...uploadFrequency);
  const bestDayIndex = uploadFrequency.indexOf(maxUploads);
  const shortDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const fullDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const bestDay = fullDays[bestDayIndex] || "Friday";
  const weekendUploads = uploadFrequency[5] + uploadFrequency[6];
  const isConsistent = uploadFrequency.filter((value) => value > 0).length >= 5;
  const performanceRatio = worstVideo.score > 0 ? bestVideo.score / worstVideo.score : 1;
  const predictedViews = Math.round(bestVideo.score * 0.55 + averageViews * 0.45);
  const variance =
    safePerformance.reduce((sum, video) => sum + Math.pow(video.score - averageViews, 2), 0) /
    safePerformance.length;
  const deviation = Math.round(Math.sqrt(variance));

  const categoryScores = {
    AI: 0,
    Developer: 0,
    Tutorial: 0,
    Strategy: 0,
  };

  const keywordMap = {
    AI: ["ai", "gemini", "model", "automation"],
    Developer: ["dev", "developer", "code", "build"],
    Tutorial: ["tutorial", "guide", "how"],
    Strategy: ["strategy", "calendar", "analytics", "planning"],
  };

  safePerformance.forEach((video) => {
    const title = video.title.toLowerCase();
    Object.entries(keywordMap).forEach(([category, keywords]) => {
      if (keywords.some((keyword) => title.includes(keyword))) {
        categoryScores[category] += video.score;
      }
    });
  });

  const trendCategory = Object.keys(categoryScores).reduce((best, current) =>
    categoryScores[current] > categoryScores[best] ? current : best
  );

  const alerts = [];

  if (!isConsistent) {
    alerts.push("Upload consistency is low. Try posting on more days each week.");
  }

  if (performanceRatio > 2) {
    alerts.push("Your top post is outperforming the rest. Reuse that theme soon.");
  }

  if (safePerformance.some((video) => video.score < averageViews * 0.75)) {
    alerts.push("Some recent posts are below your average engagement.");
  }

  if (bestVideo.score > averageViews * 1.25) {
    alerts.push("A high-performing post is ready to turn into a follow-up.");
  }

  return {
    uploadFrequency,
    uploadFrequencyLabels: shortDays,
    postPerformance: safePerformance,
    bestVideo,
    worstVideo,
    insights: {
      uploadInsight: `You are most active on ${bestDay}.`,
      performanceInsight: `Your strongest post gets ${performanceRatio.toFixed(1)}x the views of your lowest post.`,
      consistencyInsight: isConsistent
        ? "Your posting rhythm is healthy across the week."
        : "Your upload pattern has gaps that could reduce reach.",
    },
    recommendations: {
      bestDayRecommendation: `Schedule priority posts on ${bestDay}.`,
      weekendRecommendation:
        weekendUploads < 2
          ? "Weekend activity is low. Test one weekend post before scaling it."
          : "Weekend publishing is contributing useful reach.",
      strategyRecommendation:
        performanceRatio > 2
          ? `Create another post around "${bestVideo.title}" while interest is warm.`
          : "Your performance is balanced. Keep testing small topic variations.",
      consistencyRecommendation: isConsistent
        ? "Protect your current cadence with scheduled posts."
        : "Plan at least five posting days per week for steadier growth.",
    },
    automation: {
      nextBestDay: bestDay,
      contentSuggestion: `${trendCategory} content is the strongest current signal.`,
      postingAdvice:
        weekendUploads < 2
          ? "Prioritize weekdays, then test weekends with lighter content."
          : "Keep weekends in the calendar and reserve weekdays for major posts.",
      trendCategory,
    },
    alerts,
    prediction: {
      predictedViews,
      averageViews,
      performanceLevel:
        predictedViews > averageViews * 1.25
          ? "High"
          : predictedViews < averageViews * 0.8
            ? "Low"
            : "Average",
    },
    trend: {
      category: trendCategory,
      scores: categoryScores,
    },
    confidence: {
      level:
        deviation < averageViews * 0.3
          ? "High"
          : deviation > averageViews * 0.7
            ? "Low"
            : "Medium",
      deviation,
    },
  };
};

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/social-dashboard")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed:", err.message));

app.get("/", (req, res) => {
  res.json({ message: "Social Media Dashboard API is running" });
});

app.get("/api/dashboard", async (req, res) => {
  try {
    const channel = await getChannelData("statistics");
    const postCount = isDatabaseReady() ? await Post.countDocuments() : memoryPosts.length;

    if (!channel) {
      return res.json({
        followers: "24,800",
        posts: postCount || 128,
        engagement: "8.4%",
        reach: "412,900",
        weeklyEngagement: [38, 52, 64, 59, 83, 71, 76],
        recommendations: {
          bestCategory: "Strategy",
          suggestedTopics: [
            "Weekly content planning",
            "AI-assisted post ideas",
            "Behind-the-scenes creation",
            "Analytics breakdowns",
          ],
          bestPostingDay: "Friday",
          bestTime: "6 PM - 9 PM",
          suggestedFormat: "Short videos with carousel recaps",
        },
      });
    }

    const stats = channel.statistics;

    res.json({
      followers: formatNumber(stats.subscriberCount),
      posts: formatNumber(stats.videoCount),
      engagement: "Live",
      reach: formatNumber(stats.viewCount),
      weeklyEngagement: [38, 52, 64, 59, 83, 71, 76],
      recommendations: {
        bestCategory: "Developer Education",
        suggestedTopics: [
          "API demos",
          "Productivity workflows",
          "New feature explainers",
          "Short tutorials",
        ],
        bestPostingDay: "Friday",
        bestTime: "6 PM - 9 PM",
        suggestedFormat: "Short-form videos with a clear hook",
      },
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

app.get("/api/posts", async (req, res) => {
  try {
    if (!isDatabaseReady()) {
      return res.json([...memoryPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }

    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

app.post("/api/posts", async (req, res) => {
  try {
    const { title, content, platform, mediaUrl, scheduledAt } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    if (!isDatabaseReady()) {
      const now = new Date().toISOString();
      const savedPost = {
        _id: createId(),
        title,
        content,
        platform: platform || "Instagram",
        mediaUrl: mediaUrl || "",
        scheduledAt: scheduledAt || null,
        status: req.body.status || "Draft",
        likes: 0,
        comments: 0,
        shares: 0,
        createdAt: now,
        updatedAt: now,
      };
      memoryPosts.unshift(savedPost);
      return res.status(201).json(savedPost);
    }

    const savedPost = await Post.create({
      title,
      content,
      platform,
      mediaUrl,
      scheduledAt,
      status: req.body.status,
    });

    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
});

app.put("/api/posts/:id", async (req, res) => {
  try {
    if (!isDatabaseReady()) {
      const index = memoryPosts.findIndex((post) => post._id === req.params.id);

      if (index === -1) {
        return res.status(404).json({ error: "Post not found" });
      }

      memoryPosts[index] = {
        ...memoryPosts[index],
        ...req.body,
        updatedAt: new Date().toISOString(),
      };

      return res.json(memoryPosts[index]);
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to update post" });
  }
});

app.patch("/api/posts/:id/engage", async (req, res) => {
  try {
    const { type } = req.body;
    const allowed = ["likes", "comments", "shares"];

    if (!allowed.includes(type)) {
      return res.status(400).json({ error: "Invalid engagement type" });
    }

    if (!isDatabaseReady()) {
      const post = memoryPosts.find((item) => item._id === req.params.id);

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      post[type] = (post[type] || 0) + 1;
      post.updatedAt = new Date().toISOString();
      return res.json(post);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { [type]: 1 } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to update engagement" });
  }
});

app.delete("/api/posts/:id", async (req, res) => {
  try {
    if (!isDatabaseReady()) {
      const index = memoryPosts.findIndex((post) => post._id === req.params.id);

      if (index === -1) {
        return res.status(404).json({ error: "Post not found" });
      }

      memoryPosts.splice(index, 1);
      return res.json({ message: "Post deleted successfully" });
    }

    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

app.get("/api/analytics", async (req, res) => {
  try {
    const channel = await getChannelData("contentDetails");

    if (!channel) {
      return res.json(buildAnalytics(fallbackUploadFrequency, fallbackVideos));
    }

    const client = getYouTubeClient();
    const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;
    const videosRes = await client.get("/playlistItems", {
      params: {
        part: "snippet",
        playlistId: uploadsPlaylistId,
        maxResults: 20,
      },
    });

    const videos = videosRes.data.items || [];
    const uploadFrequency = [...fallbackUploadFrequency].map(() => 0);
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    videos.forEach((video) => {
      const day = new Date(video.snippet.publishedAt).toLocaleDateString("en-US", {
        weekday: "short",
      });
      const index = days.indexOf(day);
      if (index >= 0) uploadFrequency[index] += 1;
    });

    const videoIds = videos
      .slice(0, 5)
      .map((video) => video.snippet.resourceId.videoId)
      .join(",");

    if (!videoIds) {
      return res.json(buildAnalytics(fallbackUploadFrequency, fallbackVideos));
    }

    const statsRes = await client.get("/videos", {
      params: { part: "statistics", id: videoIds },
    });

    const postPerformance = videos.slice(0, 5).map((video, index) => ({
      post: `Video ${index + 1}`,
      title: video.snippet.title,
      score: Number(statsRes.data.items?.[index]?.statistics?.viewCount || 0),
    }));

    res.json(buildAnalytics(uploadFrequency, postPerformance));
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.json(buildAnalytics(fallbackUploadFrequency, fallbackVideos));
  }
});

app.get("/api/profile", async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = isDatabaseReady()
      ? await User.findOne({ email }).select("-password")
      : memoryUsers.find((storedUser) => storedUser.email === email);

    if (!user) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const { password, ...safeUser } = user.toObject ? user.toObject() : user;
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

app.put("/api/profile", async (req, res) => {
  try {
    const { email, name, bio, avatarUrl } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!isDatabaseReady()) {
      const user = memoryUsers.find((storedUser) => storedUser.email === email);

      if (!user) {
        return res.status(404).json({ error: "Profile not found" });
      }

      user.name = name;
      user.bio = bio;
      user.avatarUrl = avatarUrl || "";
      const { password, ...safeUser } = user;
      return res.json(safeUser);
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { name, bio, avatarUrl },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
