"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const data = [
  { name: "Mon", engagement: 30 },
  { name: "Tue", engagement: 45 },
  { name: "Wed", engagement: 60 },
  { name: "Thu", engagement: 50 },
  { name: "Fri", engagement: 70 },
  { name: "Sat", engagement: 90 },
  { name: "Sun", engagement: 75 }
];

export default function EngagementChart() {
  return (
    <div style={{ marginTop: "40px" }}>
      <h3>Weekly Engagement</h3>

      <LineChart width={500} height={300} data={data}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="engagement" stroke="#3b82f6" />
      </LineChart>
    </div>
  );
}