export default function EngagementChart({ data }) {
  const chartData =
    data?.map((value, index) => ({
      name: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index],
      engagement: value,
    })) || [];
  const maxValue = Math.max(...chartData.map((item) => item.engagement), 1);

  return (
    <div className="flex h-72 w-full items-end gap-3 border-b border-l border-slate-200 px-3 pb-4">
      {chartData.map((item) => (
        <div key={item.name} className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <div className="flex h-56 w-full items-end">
            <div
              className="w-full rounded-t-lg bg-blue-600 transition hover:bg-blue-700"
              style={{ height: `${Math.max((item.engagement / maxValue) * 100, 8)}%` }}
              title={`${item.name}: ${item.engagement}`}
            />
          </div>
          <span className="text-xs font-semibold text-slate-500">{item.name}</span>
        </div>
      ))}
    </div>
  );
}
