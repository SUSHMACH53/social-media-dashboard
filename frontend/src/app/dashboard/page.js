"use client";

import DashboardLayout from "../../components/layout/DashboardLayout";
import StatsCard from "../../components/dashboard/StatsCard";
import EngagementChart from "../../components/dashboard/EngagementChart";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <h1>Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <StatsCard title="Followers" value="1204" />
        <StatsCard title="Posts" value="86" />
        <StatsCard title="Engagement" value="3.4%" />
        <StatsCard title="Reach" value="12.3k" />
      </div>

      <EngagementChart />
    </DashboardLayout>
  );
}