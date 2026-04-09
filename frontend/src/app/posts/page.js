"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function PostsPage() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/youtube/videos/GoogleDevelopers")
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-xl font-semibold mb-4">
        YouTube Videos (Posts)
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((video) => (
          <div
            key={video.videoId}
            className="bg-white p-4 rounded-lg shadow-sm"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-48 object-cover rounded"
            />

            <h2 className="text-lg font-semibold mt-2">
              {video.title}
            </h2>

            <p className="text-gray-500 text-sm">
              {new Date(video.publishedAt).toLocaleDateString()}
            </p>

            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 mt-2 inline-block"
            >
              Watch Video
            </a>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}