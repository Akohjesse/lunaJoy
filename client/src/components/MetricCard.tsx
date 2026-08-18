import { InfoTooltip } from "./InfoTooltip";
import { describeMetric, formatMetricValue, metricDetails, type MetricKey } from "../wellbeing";

type MetricCardProps = {
  metric: MetricKey;
  value: number | null;
  averaged?: boolean;
};

export function MetricCard({ metric, value, averaged = false }: MetricCardProps) {
  const details = metricDetails[metric];

  return (
    <article className="rounded-2xl bg-[#f5f3ed] p-4.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold tracking-[.11em] text-muted uppercase">{averaged ? details.averageLabel : details.label}</span>
        <InfoTooltip label={`About ${details.label.toLowerCase()}`}>{details.tooltip}</InfoTooltip>
      </div>
      <strong className="mt-3 mb-1 block text-[28px] tracking-[-.04em] text-ink">{value === null ? "—" : formatMetricValue(metric, value, averaged)}</strong>
      <p className="m-0 text-sm text-muted">{value === null ? "Not enough data yet" : describeMetric(metric, value)}</p>
    </article>
  );
}
