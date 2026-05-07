"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { apiRequest } from "../../lib/api";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const previousAlerts = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analytics = await apiRequest("/api/analytics");
        setData(analytics);

        const newAlerts = analytics.alerts || [];
        if (previousAlerts.current.length > 0) {
          newAlerts.forEach((alert) => {
            if (!previousAlerts.current.includes(alert)) {
              toast(alert);
            }
          });
        }
        previousAlerts.current = newAlerts;
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  const growthData =
    data?.uploadFrequency?.map((value, index) => ({
      name: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index],
      uploads: value,
    })) || [];

  const performanceData =
    data?.postPerformance?.map((item) => ({
      name: item.post,
      score: item.score,
    })) || [];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Analytics</h1>
          <p className="mt-1 text-sm text-slate-500">
            Review performance signals, predictions, and recommended actions.
          </p>
        </div>

        {loading || !data ? (
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 text-slate-500">
            Loading analytics...
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <FeatureCard title="Top Performing Post" value={data.bestVideo.title} helper={`Views: ${data.bestVideo.score.toLocaleString()}`} />
              <FeatureCard title="Needs Improvement" value={data.worstVideo.title} helper={`Views: ${data.worstVideo.score.toLocaleString()}`} tone="rose" />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <InfoCard title="Upload Insight" value={data.insights.uploadInsight} />
              <InfoCard title="Performance Insight" value={data.insights.performanceInsight} />
              <InfoCard title="Consistency Insight" value={data.insights.consistencyInsight} />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <InfoCard title="Best Day Strategy" value={data.recommendations.bestDayRecommendation} />
              <InfoCard title="Weekend Strategy" value={data.recommendations.weekendRecommendation} />
              <InfoCard title="Content Strategy" value={data.recommendations.strategyRecommendation} />
              <InfoCard title="Consistency Advice" value={data.recommendations.consistencyRecommendation} />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <InfoCard title="Next Best Day" value={data.automation.nextBestDay} />
              <InfoCard title="Content Suggestion" value={data.automation.contentSuggestion} />
              <InfoCard title="Posting Advice" value={data.automation.postingAdvice} />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <MetricCard title="Predicted Views" value={data.prediction.predictedViews.toLocaleString()} helper={`${data.prediction.performanceLevel} expected performance`} />
              <MetricCard title="Prediction Confidence" value={data.confidence.level} helper={`Deviation: ${data.confidence.deviation.toLocaleString()}`} />
              <MetricCard title="Trending Content" value={data.trend.category} helper="Strongest current content signal" />
            </div>

            <section className="mt-6">
              <h2 className="text-lg font-bold text-slate-950">Alerts</h2>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                {data.alerts.length === 0 ? (
                  <div className="rounded-lg border border-slate-200 bg-white p-4 text-slate-500">
                    No alerts right now.
                  </div>
                ) : (
                  data.alerts.map((alert) => (
                    <div key={alert} className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900">
                      {alert}
                    </div>
                  ))
                )}
              </div>
            </section>

            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <ChartCard title="Upload Frequency">
                <ResponsiveContainer>
                  <LineChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Line type="monotone" dataKey="uploads" stroke="#2563eb" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Post Performance">
                <ResponsiveContainer>
                  <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Bar dataKey="score" fill="#059669" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function FeatureCard({ title, value, helper, tone = "green" }) {
  const classes =
    tone === "rose"
      ? "border-rose-200 bg-rose-50 text-rose-900"
      : "border-emerald-200 bg-emerald-50 text-emerald-900";

  return (
    <div className={`rounded-lg border p-5 shadow-sm ${classes}`}>
      <p className="text-sm font-bold uppercase tracking-[0.12em]">{title}</p>
      <h2 className="mt-3 text-lg font-bold">{value}</h2>
      <p className="mt-2 text-sm">{helper}</p>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-slate-500">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-700">{value}</p>
    </div>
  );
}

function MetricCard({ title, value, helper }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{helper}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-bold text-slate-950">{title}</h2>
      <div className="h-72 w-full">{children}</div>
    </section>
  );
}
