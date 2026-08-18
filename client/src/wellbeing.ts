import type { DailyLog } from "./types";

export type MetricKey = "mood" | "anxiety" | "stress" | "sleepHours";

export const metricKeys: MetricKey[] = ["mood", "anxiety", "stress", "sleepHours"];

export const metricDetails: Record<MetricKey, { label: string; averageLabel: string; color: string; tooltip: string }> = {
  mood: {
    label: "Mood",
    averageLabel: "Average mood",
    color: "#e89c66",
    tooltip: "Mood is self-rated from 1 (very low) to 5 (very good).",
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
    if (value < 1.5) return "A difficult day";
    if (value < 2.5) return "Feeling low";
    if (value < 3.5) return "Holding steady";
    if (value < 4.5) return "Feeling positive";
    return "Feeling strong";
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
  if (mood >= 3.5 && sleep >= 7) return "Your recent check-ins show steadier mood and supportive rest.";
  if (sleep < 6.5) return "Rest has been shorter lately. A gentler rhythm may feel supportive.";
  return "Your recent check-ins show a balanced mix of days. Small patterns are beginning to take shape.";
}

export function describeDay(log: DailyLog) {
  if (log.anxiety >= 4 || log.stress >= 4) return "You noticed more pressure today. That awareness can help you choose what you need next.";
  if (log.mood >= 4 && log.sleepHours >= 7) return "Your check-in points to steadier energy and supportive rest today.";
  if (log.sleepHours < 6) return "Rest was shorter today. A gentler pace may feel supportive.";
  return "Your check-in reflects a mixed, human day. Keep noticing what supports you.";
}
