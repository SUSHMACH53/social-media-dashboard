"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

// Accept data from parent (Dashboard)
export default function EngagementChart({ data }) {

  // Convert backend array → chart format
  const chartData = data?.map((value, index) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return {
      name: days[index],
      engagement: value
    };
  }) || [];

  return (
    <div style={{ marginTop: "40px" }}>
      <h3>Weekly Engagement</h3>

      <LineChart width={500} height={300} data={chartData}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="engagement" stroke="#3b82f6" />
      </LineChart>
    </div>
  );
}