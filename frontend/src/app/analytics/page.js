"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  LineChart,Line,XAxis,YAxis,Tooltip,CartesianGrid,BarChart,Bar
} from "recharts";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);

useEffect(() => {
  const fetchData = () => {
    fetch("http://localhost:5000/api/analytics")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  };

  fetchData(); // first load

  const interval = setInterval(fetchData, 10000); // every 10 sec

  return () => clearInterval(interval);
}, []);

  if (!data) {
    return (
      <DashboardLayout>
        <p>Loading analytics...</p>
      </DashboardLayout>
    );
  }

  // Upload frequency (Mon–Sun)
  const growthData = data.uploadFrequency.map((value, index) => ({
    name: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index],
    uploads: value,
  }));
// STEP: Combine title + views
const performanceData = data.postPerformance.map((item) => ({
  name: item.post,
  score: item.score,
}));
// Find best performing video
const bestVideo = data.bestVideo;
const worstVideo = data.worstVideo;

return (
  <DashboardLayout>
    <h1 className="text-xl font-semibold">Analytics</h1>

    {/* Best & Worst */}
    <div className="mt-6 bg-green-100 p-4 rounded-lg shadow-sm">
      <h2 className="font-semibold text-green-800">Top Performing Video</h2>
      <p className="mt-2 text-lg font-bold">{bestVideo.title}</p>
      <p className="text-gray-700">Views: {bestVideo.score}</p>
    </div>

    <div className="mt-4 bg-red-100 p-4 rounded-lg shadow-sm">
      <h2 className="font-semibold text-red-800">Needs Improvement</h2>
      <p className="mt-2 text-lg font-bold">{worstVideo.title}</p>
      <p className="text-gray-700">Views: {worstVideo.score}</p>
    </div>

    {/* AI Insights */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <div className="bg-blue-100 p-4 rounded-lg">
        <h2 className="font-semibold text-blue-800">Upload Insight</h2>
        <p>{data.insights.uploadInsight}</p>
      </div>

      <div className="bg-purple-100 p-4 rounded-lg">
        <h2 className="font-semibold text-purple-800">Performance Insight</h2>
        <p>{data.insights.performanceInsight}</p>
      </div>

      <div className="bg-yellow-100 p-4 rounded-lg">
        <h2 className="font-semibold text-yellow-800">Consistency Insight</h2>
        <p>{data.insights.consistencyInsight}</p>
      </div>
    </div>

    {/* ✅ Recommendations Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

      <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-blue-700">Best Day Strategy</h3>
        <p>{data.recommendations.bestDayRecommendation}</p>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-purple-700">Weekend Strategy</h3>
        <p>{data.recommendations.weekendRecommendation}</p>
      </div>

      <div className="bg-green-50 p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-green-700">Content Strategy</h3>
        <p>{data.recommendations.strategyRecommendation}</p>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-yellow-700">Consistency Advice</h3>
        <p>{data.recommendations.consistencyRecommendation}</p>
      </div>

    </div>

    {/* ✅ Charts Side by Side */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

      {/* Upload Frequency */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="mb-4 font-semibold">Upload Frequency</h2>

        <LineChart width={400} height={250} data={growthData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="uploads" stroke="#3b82f6" />
        </LineChart>
      </div>

      {/* Video Performance */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="mb-4 font-semibold">Video Performance</h2>

        <BarChart width={400} height={250} data={performanceData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="score" fill="#10b981" />
        </BarChart>
      </div>

    </div>

  </DashboardLayout>
);
}