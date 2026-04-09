const express = require("express"); // ✅ correct
const axios = require("axios");

const router = express.Router();

// Get channel data
router.get("/channel/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const apiKey = process.env.YOUTUBE_API_KEY;

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        params: {
          part: "snippet,statistics",
          forUsername: username,
          key: apiKey,
        },
      }
    );

    const channel = response.data.items[0];

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

// Get videos
router.get("/videos/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const apiKey = process.env.YOUTUBE_API_KEY;

    const channelRes = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        params: {
          part: "contentDetails",
          forUsername: username,
          key: apiKey,
        },
      }
    );

    const channel = channelRes.data.items[0];

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const uploadsPlaylistId =
      channel.contentDetails.relatedPlaylists.uploads;

    const videosRes = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlistItems",
      {
        params: {
          part: "snippet",
          playlistId: uploadsPlaylistId,
          maxResults: 10,
          key: apiKey,
        },
      }
    );

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

module.exports = router;