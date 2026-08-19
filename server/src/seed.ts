import { db } from "./db.js";

const sampleLogs = [
  {
    daysAgo: 7,
    mood: 3,
    anxiety: 4,
    sleepHours: 6,
    sleepQuality: 3,
    sleepDisturbances: "Woke up once during the night",
    activityType: "Walking",
    activityMinutes: 20,
    socialInteractions: 2,
    stress: 4,
    symptoms: [{ name: "Worry", severity: 3 }],
    notes: "A demanding day, but the evening walk helped.",
  },
  { daysAgo: 6, mood: 3, anxiety: 3, sleepHours: 6.5, sleepQuality: 3, sleepDisturbances: "", activityType: "Stretching", activityMinutes: 15, socialInteractions: 3, stress: 3, symptoms: [{ name: "Low energy", severity: 2 }], notes: "Energy improved gradually through the afternoon." },
  { daysAgo: 5, mood: 4, anxiety: 3, sleepHours: 7, sleepQuality: 4, sleepDisturbances: "", activityType: "Cycling", activityMinutes: 35, socialInteractions: 4, stress: 3, symptoms: [], notes: "Enjoyed moving and spending time with friends." },
  {
    daysAgo: 4,
    mood: 3,
    anxiety: 4,
    sleepHours: 5.5,
    sleepQuality: 2,
    sleepDisturbances: "Had trouble falling asleep",
    activityType: "Walking",
    activityMinutes: 10,
    socialInteractions: 2,
    stress: 4,
    symptoms: [
      { name: "Trouble focusing", severity: 3 },
      { name: "Worry", severity: 3 },
    ],
    notes: "Rest felt short, so I kept the day gentle.",
  },
  { daysAgo: 3, mood: 4, anxiety: 2, sleepHours: 7.5, sleepQuality: 4, sleepDisturbances: "", activityType: "Yoga", activityMinutes: 30, socialInteractions: 3, stress: 2, symptoms: [], notes: "Felt calmer after taking time to slow down." },
  { daysAgo: 2, mood: 5, anxiety: 2, sleepHours: 8, sleepQuality: 5, sleepDisturbances: "", activityType: "Swimming", activityMinutes: 40, socialInteractions: 4, stress: 2, symptoms: [], notes: "Good rest and movement supported a happier day." },
  { daysAgo: 1, mood: 4, anxiety: 2, sleepHours: 7.5, sleepQuality: 4, sleepDisturbances: "", activityType: "Walking", activityMinutes: 30, socialInteractions: 4, stress: 2, symptoms: [{ name: "Low energy", severity: 1 }], notes: "A balanced day with manageable pressure." },
];

function dateDaysAgo(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

export function seedSampleHistory(userId: number) {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO daily_logs (
      user_id, log_date, mood, anxiety, sleep_hours, sleep_quality,
      sleep_disturbances, activity_type, activity_minutes,
      social_interactions, stress, symptoms, notes
    ) VALUES (
      @userId, @date, @mood, @anxiety, @sleepHours, @sleepQuality,
      @sleepDisturbances, @activityType, @activityMinutes,
      @socialInteractions, @stress, @symptoms, @notes
    )
  `);

  db.transaction(() => {
    for (const sample of sampleLogs) {
      insert.run({
        ...sample,
        userId,
        date: dateDaysAgo(sample.daysAgo),
        symptoms: JSON.stringify(sample.symptoms),
      });
    }
  })();
}
