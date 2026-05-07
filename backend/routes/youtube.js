const express = require("express");
const axios = require("axios");

const router = express.Router();

const demoVideos = [
  {
    title: "AI workflow tips for creators",
    thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=900&q=80",
    publishedAt: new Date().toISOString(),
    videoId: "demo-1",
  },
  {
    title: "Build a better posting calendar",
    thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=900&q=80",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    videoId: "demo-2",
  },
  {
    title: "Analytics explained simply",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    videoId: "demo-3",
  },
];

router.get("/channel/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return res.json({
        title: username,
        description: "Demo channel data. Add YOUTUBE_API_KEY for live YouTube stats.",
        subscribers: "24800",
        totalViews: "412900",
        totalVideos: "128",
      });
    }

    const response = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
      params: {
        part: "snippet,statistics",
        forUsername: username,
        key: apiKey,
      },
    });

    const channel = response.data.items?.[0];

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    res.json({
      title: channel.snippet.title,
      description: channel.snippet.description,
      subscribers: channel.statistics.subscriberCount,
      totalViews: channel.statistics.viewCount,
      totalVideos: channel.statistics.videoCount,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch channel data" });
  }
});

router.get("/videos/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return res.json(demoVideos);
    }

    const channelRes = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
      params: {
        part: "contentDetails",
        forUsername: username,
        key: apiKey,
      },
    });

    const channel = channelRes.data.items?.[0];

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const videosRes = await axios.get("https://www.googleapis.com/youtube/v3/playlistItems", {
      params: {
        part: "snippet",
        playlistId: channel.contentDetails.relatedPlaylists.uploads,
        maxResults: 10,
        key: apiKey,
      },
    });

    const videos = videosRes.data.items.map((item) => ({
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      publishedAt: item.snippet.publishedAt,
      videoId: item.snippet.resourceId.videoId,
    }));

    res.json(videos);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

router.get("/dashboard", (req, res) => {
  res.json({
    message: "Dashboard insights",
    recommendations: {
      bestCategory: "Strategy",
      suggestedTopics: [
        "AI-assisted content ideas",
        "Weekly planning workflows",
        "Analytics breakdowns",
        "Creator productivity tips",
      ],
      bestPostingDay: "Friday",
      bestTime: "6 PM - 9 PM",
      suggestedFormat: "Short videos with carousel recaps",
    },
  });
});

module.exports = router;
