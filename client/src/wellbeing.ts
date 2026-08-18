import type { DailyLog } from "./types";

export type MetricKey = "mood" | "anxiety" | "stress" | "sleepHours";
export type TrendMetricKey = MetricKey | "sleepQuality" | "activityMinutes" | "socialInteractions";

export const metricKeys: MetricKey[] = ["mood", "anxiety", "stress", "sleepHours"];
export const trendMetricKeys: TrendMetricKey[] = ["mood", "anxiety", "stress", "sleepHours", "sleepQuality", "activityMinutes", "socialInteractions"];
export const defaultTrendMetrics: TrendMetricKey[] = ["mood", "stress", "sleepHours"];

export const metricDetails: Record<MetricKey, { label: string; averageLabel: string; color: string; tooltip: string }> = {
  mood: {
    label: "Mood",
    averageLabel: "Average mood",
    color: "#e89c66",
    tooltip: "Mood is self-rated from 1 (very sad) to 5 (very happy).",
  },
  anxiety: {
    label: "Anxiety",
    averageLabel: "Average anxiety",
    color: "#6f8f86",
    tooltip: "Anxiety is self-rated from 1 (calm) to 5 (very anxious).",
  },
  stress: {
    label: "Stress",
    averageLabel: "Average stress",
    color: "#c77768",
    tooltip: "Stress is self-rated from 1 (low) to 5 (very high).",
  },
  sleepHours: {
    label: "Sleep",
    averageLabel: "Average sleep",
    color: "#a98fc4",
    tooltip: "Sleep shows the number of hours recorded in each daily check-in.",
  },
};

export const trendMetricDetails: Record<TrendMetricKey, { label: string; color: string; tooltip: string }> = {
  mood: metricDetails.mood,
  anxiety: metricDetails.anxiety,
  stress: metricDetails.stress,
  sleepHours: metricDetails.sleepHours,
  sleepQuality: {
    label: "Sleep quality",
    color: "#628ea7",
    tooltip: "Sleep quality is self-rated from 1 (very poor) to 5 (restorative).",
  },
  activityMinutes: {
    label: "Movement",
    color: "#d19a3f",
    tooltip: "Movement shows the number of active minutes recorded in each check-in.",
  },
  socialInteractions: {
    label: "Social engagement",
    color: "#518a84",
    tooltip: "Social engagement records frequency from 1 (none) to 5 (very frequent).",
  },
};

export function averageMetric(logs: DailyLog[], key: MetricKey) {
  if (!logs.length) return null;
  return logs.reduce((total, log) => total + log[key], 0) / logs.length;
}

export function formatMetricValue(key: MetricKey, value: number, averaged = false) {
  const formatted = averaged ? value.toFixed(1) : Number.isInteger(value) ? String(value) : value.toFixed(1);
  return key === "sleepHours" ? `${formatted}h` : `${formatted}/5`;
}

export function describeMetric(key: MetricKey, value: number) {
  if (key === "mood") {
    if (value < 1.5) return "Very sad";
    if (value < 2.5) return "Sad";
    if (value < 3.5) return "Neutral";
    if (value < 4.5) return "Happy";
    return "Very happy";
  }

  if (key === "anxiety") {
    if (value < 1.5) return "Feeling calm";
    if (value < 2.5) return "Mostly settled";
    if (value < 3.5) return "Some unease";
    if (value < 4.5) return "Anxiety felt high";
    return "A very anxious day";
  }

  if (key === "stress") {
    if (value < 1.5) return "Feeling at ease";
    if (value < 2.5) return "Manageable";
    if (value < 3.5) return "Some pressure";
    if (value < 4.5) return "A demanding day";
    return "Stress felt intense";
  }

  if (value < 5) return "Very little rest";
  if (value < 6.5) return "Rest may feel short";
  if (value < 8) return "Good rest";
  if (value <= 9) return "Well rested";
  return "Extra rest";
}

export function describePeriod(logs: DailyLog[]) {
  if (!logs.length) return "Complete a check-in and your patterns will begin to take shape here.";

  const mood = averageMetric(logs, "mood") ?? 0;
  const anxiety = averageMetric(logs, "anxiety") ?? 0;
  const stress = averageMetric(logs, "stress") ?? 0;
  const sleep = averageMetric(logs, "sleepHours") ?? 0;

  if (anxiety >= 3.5 || stress >= 3.5) return "This period carried more pressure. Notice where extra support or recovery could help.";
  if (mood <= 2.5) return "Mood has leaned sadder in this period. Notice what support might feel useful.";
  if (mood >= 3.5 && sleep >= 7) return "Your recent check-ins lean happier alongside supportive rest.";
  if (sleep < 6.5) return "Rest has been shorter lately. A gentler rhythm may feel supportive.";
  return "Your recent check-ins show a balanced mix of days. Small patterns are beginning to take shape.";
}

export function describeDay(log: DailyLog) {
  if (log.mood <= 2) return "You reported feeling sadder today. A gentler pace or reaching out may feel supportive.";
  if (log.anxiety >= 4 || log.stress >= 4) return "You noticed more pressure today. That awareness can help you choose what you need next.";
  if (log.mood >= 4 && log.sleepHours >= 7) return "You reported a happier mood alongside supportive rest today.";
  if (log.sleepHours < 6) return "Rest was shorter today. A gentler pace may feel supportive.";
  return "Your check-in reflects a mixed, human day. Keep noticing what supports you.";
}

export function trendMetricValue(log: DailyLog, key: TrendMetricKey) {
  return log[key];
}

export function normalizeTrendMetric(log: DailyLog, key: TrendMetricKey) {
  const value = trendMetricValue(log, key);
  if (key === "sleepHours") return Math.min(value / 2, 5);
  if (key === "activityMinutes") return Math.min(value / 12, 5);
  return value;
}

export function formatTrendMetric(key: TrendMetricKey, value: number) {
  if (key === "sleepHours") return `${Number.isInteger(value) ? value : value.toFixed(1)}h`;
  if (key === "activityMinutes") return `${value} min`;
  return `${Number.isInteger(value) ? value : value.toFixed(1)}/5`;
}

export function describeTrendMetric(key: TrendMetricKey, value: number) {
  if (key === "mood" || key === "anxiety" || key === "stress" || key === "sleepHours") return describeMetric(key, value);
  if (key === "sleepQuality") return ["", "Very poor", "Poor", "Fair", "Good", "Restorative"][Math.round(value)];
  if (key === "activityMinutes") {
    if (value === 0) return "No movement logged";
    if (value < 15) return "A little movement";
    if (value < 30) return "Gentle movement";
    if (value <= 60) return "Active time";
    return "Extended movement";
  }
  if (value < 1.5) return "No social engagements";
  if (value < 2.5) return "A few engagements";
  if (value < 3.5) return "Some engagement";
  if (value < 4.5) return "Frequent engagement";
  return "Very frequent engagement";
}
