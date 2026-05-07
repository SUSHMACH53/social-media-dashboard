"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatsCard from "../../components/dashboard/StatsCard";
import EngagementChart from "../../components/dashboard/EngagementChart";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { apiRequest } from "../../lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const recommendations = stats?.recommendations || {};
  const suggestedTopics = Array.isArray(recommendations.suggestedTopics)
    ? recommendations.suggestedTopics
    : [];

  useEffect(() => {
    apiRequest("/api/dashboard")
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">
              Your command center for content, reach, and engagement.
            </p>
          </div>
          <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
            Live workspace
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">
            {error}
          </div>
        ) : null}

        {!stats ? (
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 text-slate-500">
            Loading dashboard...
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatsCard title="Followers" value={stats.followers} helper="Total audience size" />
              <StatsCard title="Posts" value={stats.posts} helper="Published and planned content" />
              <StatsCard title="Engagement" value={stats.engagement} helper="Current activity signal" />
              <StatsCard title="Reach" value={stats.reach} helper="Total content views" />
            </div>

            <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="font-bold text-slate-950">Weekly Engagement</h2>
                <p className="text-sm text-slate-500">A quick view of recent audience activity.</p>
              </div>
              <EngagementChart data={stats.weeklyEngagement || []} />
            </section>

            {stats.recommendations ? (
              <section className="mt-6">
                <h2 className="text-lg font-bold text-slate-950">Content Intelligence</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <InsightCard title="Best Category" value={recommendations.bestCategory || "Not available"} />
                  <InsightCard title="Best Posting Day" value={recommendations.bestPostingDay || "Not available"} />
                  <InsightCard title="Best Time" value={recommendations.bestTime || "Not available"} />
                  <InsightCard title="Suggested Format" value={recommendations.suggestedFormat || "Not available"} />
                </div>

                <div className="mt-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="font-bold text-slate-950">Suggested Topics</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {suggestedTopics.length === 0 ? (
                      <span className="text-sm text-slate-500">No topic suggestions available.</span>
                    ) : null}
                    {suggestedTopics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}
          </>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function InsightCard({ title, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 font-bold text-slate-950">{value}</p>
    </div>
  );
}
