"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/analytics")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
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

  return (
    <DashboardLayout>
      <h1 className="text-xl font-semibold">Analytics</h1>

      {/* Upload Frequency Chart */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
        <h2 className="mb-4 font-semibold">Upload Frequency</h2>

        <LineChart width={500} height={300} data={growthData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="uploads" stroke="#3b82f6" />
        </LineChart>
      </div>

      {/* Post Performance Chart */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
        <h2 className="mb-4 font-semibold">Video Performance</h2>

        <BarChart width={500} height={300} data={performanceData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="score" fill="#10b981" />
        </BarChart>
      </div>
    </DashboardLayout>
  );
}