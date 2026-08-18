import { format, parseISO } from "date-fns";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipContentProps } from "recharts";
import type { DailyLog } from "../types";
import { describeMetric, formatMetricValue, metricDetails, type MetricKey } from "../wellbeing";

type ChartPoint = DailyLog & {
  label: string;
  sleepScore: number;
};

function ChartTooltip({ active, label, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as ChartPoint;

  return (
    <div className="min-w-48 rounded-xl border border-line bg-panel p-3.5 shadow-[0_12px_30px_rgba(38,59,52,.14)]">
      <strong className="text-sm text-ink">{label}</strong>
      <div className="mt-2.5 space-y-2">
        {payload.map((entry) => {
          const metric = (entry.dataKey === "sleepScore" ? "sleepHours" : entry.dataKey) as MetricKey;
          const value = point[metric];

          return (
            <div className="flex items-start justify-between gap-5 text-xs" key={metric}>
              <span className="flex items-center gap-2 text-muted">
                <i className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {metricDetails[metric].label}
              </span>
              <span className="text-right">
                <strong className="block text-ink">{formatMetricValue(metric, value)}</strong>
                <small className="text-muted">{describeMetric(metric, value)}</small>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TrendChart({ logs }: { logs: DailyLog[] }) {
  const data: ChartPoint[] = logs.map((log) => ({
    ...log,
    label: format(parseISO(log.date), "MMM d"),
    sleepScore: Math.min(log.sleepHours / 2, 5),
  }));

  if (!logs.length) {
    return (
      <div className="grid min-h-[290px] place-content-center justify-items-center text-center">
        <span className="grid h-11.5 w-11.5 place-items-center rounded-[14px] bg-[#edf0e9] text-[#b77e57]">✦</span>
        <h3 className="mt-3.5 mb-1">Your trends will appear here</h3>
        <p className="m-0 max-w-[340px] text-[13px] text-muted">Complete a check-in to get started.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[310px] w-full">
      <ResponsiveContainer width="100%" height={310}>
        <LineChart data={data} margin={{ top: 16, right: 16, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="#e8e4da" vertical={false} strokeDasharray="4 4" />
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#7a7d76", fontSize: 12 }} dy={10} />
          <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fill: "#7a7d76", fontSize: 12 }} ticks={[0, 1, 2, 3, 4, 5]} />
          <Tooltip content={ChartTooltip} cursor={{ stroke: "#cfc9bc", strokeDasharray: "4 4" }} />
          <Line type="monotone" dataKey="mood" name="Mood" stroke={metricDetails.mood.color} strokeWidth={3} dot={{ r: 4, fill: "#fff", strokeWidth: 3 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="anxiety" name="Anxiety" stroke={metricDetails.anxiety.color} strokeWidth={3} dot={{ r: 4, fill: "#fff", strokeWidth: 3 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="stress" name="Stress" stroke={metricDetails.stress.color} strokeWidth={3} dot={{ r: 4, fill: "#fff", strokeWidth: 3 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="sleepScore" name="Sleep" stroke={metricDetails.sleepHours.color} strokeWidth={3} dot={{ r: 4, fill: "#fff", strokeWidth: 3 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
