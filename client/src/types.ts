export type User = {
  id: number;
  email: string;
  name: string;
  avatarUrl: string | null;
};

export type Symptom = {
  name: string;
  severity: number;
};

export type DailyLog = {
  id: number;
  date: string;
  mood: number;
  anxiety: number;
  sleepHours: number;
  sleepQuality: number;
  sleepDisturbances: string;
  activityType: string;
  activityMinutes: number;
  socialInteractions: number;
  stress: number;
  symptoms: Symptom[];
  notes: string;
  updatedAt: string;
};

export type LogInput = Omit<DailyLog, "id" | "updatedAt">;
