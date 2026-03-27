"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatsCard from "../../components/dashboard/StatsCard";
import EngagementChart from "../../components/dashboard/EngagementChart";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);

  if (!stats) {
    return (
      <DashboardLayout>
        <p>Loading...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4 mt-4">
        <StatsCard title="Followers" value={stats.followers} />
        <StatsCard title="Posts" value={stats.posts} />
        <StatsCard title="Engagement" value={stats.engagement} />
        <StatsCard title="Reach" value={stats.reach} />
      </div>

      <div className="mt-8 bg-white p-4 rounded-lg shadow-sm">
        <h2 className="font-semibold mb-4">Weekly Engagement</h2>
        <EngagementChart />
      </div>
    </DashboardLayout>
  );
}