import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../db.js";
import { requireAuth } from "../auth.js";

const symptomSchema = z.object({
  name: z.string().trim().min(1).max(80),
  severity: z.number().int().min(1).max(5),
});

const logSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  mood: z.number().int().min(1).max(5),
  anxiety: z.number().int().min(1).max(5),
  sleepHours: z.number().min(0).max(24),
  sleepQuality: z.number().int().min(1).max(5),
  sleepDisturbances: z.string().trim().max(500),
  activityType: z.string().trim().max(120),
  activityMinutes: z.number().int().min(0).max(1440),
  socialInteractions: z.number().int().min(1).max(5),
  stress: z.number().int().min(1).max(5),
  symptoms: z.array(symptomSchema).max(12),
  notes: z.string().trim().max(1000),
});

type LogRow = {
  id: number;
  log_date: string;
  mood: number;
  anxiety: number;
  sleep_hours: number;
  sleep_quality: number;
  sleep_disturbances: string;
  activity_type: string;
  activity_minutes: number;
  social_interactions: number;
  stress: number;
  symptoms: string;
  notes: string;
  updated_at: string;
};

function serialize(row: LogRow) {
  return {
    id: row.id,
    date: row.log_date,
    mood: row.mood,
    anxiety: row.anxiety,
    sleepHours: row.sleep_hours,
    sleepQuality: row.sleep_quality,
    sleepDisturbances: row.sleep_disturbances,
    activityType: row.activity_type,
    activityMinutes: row.activity_minutes,
    socialInteractions: row.social_interactions,
    stress: row.stress,
    symptoms: JSON.parse(row.symptoms),
    notes: row.notes,
    updatedAt: row.updated_at,
  };
}

export async function logRoutes(app: FastifyInstance) {
  const saveLog = async (request: Parameters<typeof requireAuth>[0], reply: Parameters<typeof requireAuth>[1]) => {
    const parsed = logSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        message: "Please review the highlighted check-in details.",
        issues: parsed.error.flatten(),
      });
    }

    const input = parsed.data;
    db.prepare(
      `
      INSERT INTO daily_logs (
        user_id, log_date, mood, anxiety, sleep_hours, sleep_quality,
        sleep_disturbances, activity_type, activity_minutes,
        social_interactions, stress, symptoms, notes
      ) VALUES (
        @userId, @date, @mood, @anxiety, @sleepHours, @sleepQuality,
        @sleepDisturbances, @activityType, @activityMinutes,
        @socialInteractions, @stress, @symptoms, @notes
      )
      ON CONFLICT(user_id, log_date) DO UPDATE SET
        mood = excluded.mood,
        anxiety = excluded.anxiety,
        sleep_hours = excluded.sleep_hours,
        sleep_quality = excluded.sleep_quality,
        sleep_disturbances = excluded.sleep_disturbances,
        activity_type = excluded.activity_type,
        activity_minutes = excluded.activity_minutes,
        social_interactions = excluded.social_interactions,
        stress = excluded.stress,
        symptoms = excluded.symptoms,
        notes = excluded.notes,
        updated_at = CURRENT_TIMESTAMP
    `,
    ).run({ ...input, userId: request.user.id, symptoms: JSON.stringify(input.symptoms) });

    const row = db.prepare("SELECT * FROM daily_logs WHERE user_id = ? AND log_date = ?").get(request.user.id, input.date) as LogRow;
    const log = serialize(row);
    app.broadcastLogUpdate(request.user.id, log);
    return reply.code(201).send({ log });
  };

  app.post("/api/log", { preHandler: requireAuth }, saveLog);

  app.get("/api/logs", { preHandler: requireAuth }, async (request) => {
    const query = z.object({ period: z.enum(["week", "month"]).default("week") }).parse(request.query);
    const days = query.period === "week" ? 7 : 30;
    const rows = db
      .prepare(
        `
      SELECT * FROM daily_logs
      WHERE user_id = ? AND log_date >= date('now', ?)
      ORDER BY log_date ASC
    `,
      )
      .all(request.user.id, `-${days - 1} days`) as LogRow[];

    return { logs: rows.map(serialize), period: query.period };
  });
}
