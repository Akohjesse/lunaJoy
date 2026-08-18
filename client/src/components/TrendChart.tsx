import { format, parseISO } from "date-fns";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipContentProps } from "recharts";
import type { DailyLog } from "../types";
import { describeTrendMetric, formatTrendMetric, normalizeTrendMetric, trendMetricDetails, trendMetricKeys, trendMetricValue, type TrendMetricKey } from "../wellbeing";

type ChartPoint = Record<TrendMetricKey, number> & {
  label: string;
  log: DailyLog;
};

function ChartTooltip({ active, label, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as ChartPoint;

  return (
    <div className="min-w-48 rounded-xl border border-line bg-panel p-3.5 shadow-[0_12px_30px_rgba(38,59,52,.14)]">
      <strong className="text-sm text-ink">{label}</strong>
      <div className="mt-2.5 space-y-2">
        {payload.map((entry) => {
          const metric = entry.dataKey as TrendMetricKey;
          const value = trendMetricValue(point.log, metric);

          return (
            <div className="flex items-start justify-between gap-5 text-xs" key={metric}>
              <span className="flex items-center gap-2 text-muted">
                <i className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {trendMetricDetails[metric].label}
              </span>
              <span className="text-right">
                <strong className="block text-ink">{formatTrendMetric(metric, value)}</strong>
                <small className="text-muted">{describeTrendMetric(metric, value)}</small>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TrendChart({ logs, metrics }: { logs: DailyLog[]; metrics: TrendMetricKey[] }) {
  const data: ChartPoint[] = logs.map((log) => ({
    ...Object.fromEntries(trendMetricKeys.map((metric) => [metric, normalizeTrendMetric(log, metric)])),
    label: format(parseISO(log.date), "MMM d"),
    log,
  })) as ChartPoint[];

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
          {metrics.map((metric) => (
            <Line type="monotone" dataKey={metric} name={trendMetricDetails[metric].label} stroke={trendMetricDetails[metric].color} strokeWidth={3} dot={{ r: 4, fill: "#fff", strokeWidth: 3 }} activeDot={{ r: 6 }} isAnimationActive={false} key={metric} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
