import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.resolve(currentDirectory, "../.env"), quiet: true });

const production = process.env.NODE_ENV === "production";
const jwtSecret = process.env.JWT_SECRET ?? "development-secret-change-before-production";
const googleClientId = process.env.GOOGLE_CLIENT_ID ?? "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET ?? "";

if (Boolean(googleClientId) !== Boolean(googleClientSecret)) {
  throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be configured together.");
}

if (production && jwtSecret === "development-secret-change-before-production") {
  throw new Error("JWT_SECRET must be configured in production.");
}

if (production && !googleClientId) {
  throw new Error("Google authentication must be configured in production.");
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  host: process.env.HOST ?? "0.0.0.0",
  webOrigin: process.env.WEB_ORIGIN ?? "http://localhost:5173",
  jwtSecret,
  googleClientId,
  googleClientSecret,
  googleEnabled: Boolean(googleClientId && googleClientSecret),
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL ?? "http://localhost:4000/api/auth/google/callback",
  databasePath: path.resolve(process.cwd(), process.env.DATABASE_PATH ?? "./data/lunajoy.db"),
  production,
};
