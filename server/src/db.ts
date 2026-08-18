import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { config } from "./config.js";

fs.mkdirSync(path.dirname(config.databasePath), { recursive: true });

export const db = new Database(config.databasePath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    google_id TEXT UNIQUE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS daily_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    log_date TEXT NOT NULL,
    mood INTEGER NOT NULL CHECK (mood BETWEEN 1 AND 5),
    anxiety INTEGER NOT NULL CHECK (anxiety BETWEEN 1 AND 5),
    sleep_hours REAL NOT NULL CHECK (sleep_hours BETWEEN 0 AND 24),
    sleep_quality INTEGER NOT NULL CHECK (sleep_quality BETWEEN 1 AND 5),
    sleep_disturbances TEXT NOT NULL DEFAULT '',
    activity_type TEXT NOT NULL DEFAULT '',
    activity_minutes INTEGER NOT NULL DEFAULT 0 CHECK (activity_minutes BETWEEN 0 AND 1440),
    social_interactions INTEGER NOT NULL CHECK (social_interactions BETWEEN 1 AND 5),
    stress INTEGER NOT NULL CHECK (stress BETWEEN 1 AND 5),
    symptoms TEXT NOT NULL DEFAULT '[]',
    notes TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, log_date)
  );

  CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date
  ON daily_logs(user_id, log_date DESC);
`);
