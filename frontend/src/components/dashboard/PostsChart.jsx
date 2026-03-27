"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const data = [
  { name: "Post 1", likes: 120 },
  { name: "Post 2", likes: 90 },
  { name: "Post 3", likes: 150 },
  { name: "Post 4", likes: 80 }
];

export default function PostsChart() {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="likes" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}