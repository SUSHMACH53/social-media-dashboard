"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const data = [
  { name: "Jan", followers: 400 },
  { name: "Feb", followers: 800 },
  { name: "Mar", followers: 1200 },
  { name: "Apr", followers: 1600 },
  { name: "May", followers: 2000 }
];

export default function FollowersChart() {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="followers" stroke="#10b981" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}