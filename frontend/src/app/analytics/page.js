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

  // Convert followersGrowth → chart format
  const growthData = data.followersGrowth.map((value, index) => ({
    name: `Week ${index + 1}`,
    followers: value
  }));

  return (
    <DashboardLayout>
      <h1 className="text-xl font-semibold">Analytics</h1>

      {/* Followers Growth Chart */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
        <h2 className="mb-4 font-semibold">Followers Growth</h2>

        <LineChart width={500} height={300} data={growthData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="followers" stroke="#3b82f6" />
        </LineChart>
      </div>

      {/* Post Performance Chart */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
        <h2 className="mb-4 font-semibold">Post Performance</h2>

        <BarChart width={500} height={300} data={data.postPerformance}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="post" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="likes" fill="#10b981" />
        </BarChart>
      </div>
    </DashboardLayout>
  );
}