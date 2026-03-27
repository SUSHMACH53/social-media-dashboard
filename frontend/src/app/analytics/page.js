"use client";

import DashboardLayout from "../../components/layout/DashboardLayout";
import EngagementChart from "../../components/dashboard/EngagementChart";
import FollowersChart from "../../components/dashboard/FollowersChart";
import PostsChart from "../../components/dashboard/PostsChart";
export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <h1 className="text-xl font-semibold">Analytics</h1>

      <div className="grid gap-6 mt-6">

        {/* Engagement */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="font-semibold mb-4">Engagement Overview</h2>
          <EngagementChart />
        </div>

        {/* Followers Growth */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="font-semibold mb-4">Followers Growth</h2>
          <FollowersChart />
        </div>
        {/* Posts Performance */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="font-semibold mb-4">Posts Performance</h2>
          <PostsChart />
        </div>

      </div>
    </DashboardLayout>
  );
}