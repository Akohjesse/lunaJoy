import type { FastifyInstance, FastifyReply } from "fastify";
import { OAuth2Client } from "google-auth-library";
import { config } from "../config.js";
import { db } from "../db.js";
import { requireAuth } from "../auth.js";
import type { SessionUser } from "../types.js";

type UserRow = {
  id: number;
  email: string;
  name: string;
  avatar_url: string | null;
};

const googleClient = new OAuth2Client();

function authReturnUrl(authError?: string) {
  const url = new URL(config.webOrigin);
  url.searchParams.set("authComplete", authError ? "error" : "success");
  if (authError) url.searchParams.set("authError", authError);
  return url.toString();
}

function toSessionUser(row: UserRow): SessionUser {
  return { id: row.id, email: row.email, name: row.name, avatarUrl: row.avatar_url };
}

function setSession(reply: FastifyReply, user: SessionUser) {
  const token = reply.server.jwt.sign(user, { expiresIn: "7d" });
  reply.setCookie("lunajoy_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: config.production,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function authRoutes(app: FastifyInstance) {
  app.get("/api/auth/google/callback", async (request, reply) => {
    if (!app.oauth2Google) {
      return reply.redirect(authReturnUrl("google_not_configured"));
    }

    let stage = "token exchange";

    try {
      const { token } = await app.oauth2Google.getAccessTokenFromAuthorizationCodeFlow(request, reply);
      stage = "identity verification";

      if (!token.id_token) {
        throw new Error("Google did not return an ID token");
      }

      const ticket = await googleClient.verifyIdToken({
        idToken: token.id_token,
        audience: config.googleClientId,
      });
      const profile = ticket.getPayload();

      if (!profile?.sub || !profile.email || !profile.name || profile.email_verified !== true) {
        throw new Error("Google did not return a complete verified profile");
      }

      stage = "account save";
      db.prepare(
        `
        INSERT INTO users (google_id, email, name, avatar_url)
        VALUES (@googleId, @email, @name, @avatarUrl)
        ON CONFLICT(email) DO UPDATE SET
          google_id = excluded.google_id,
          name = excluded.name,
          avatar_url = excluded.avatar_url,
          updated_at = CURRENT_TIMESTAMP
      `,
      ).run({
        googleId: profile.sub,
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.picture ?? null,
      });

      const row = db.prepare("SELECT id, email, name, avatar_url FROM users WHERE email = ?").get(profile.email) as UserRow;
      setSession(reply, toSessionUser(row));
      return reply.redirect(authReturnUrl());
    } catch (error) {
      request.log.error(
        {
          authStage: stage,
          errorName: error instanceof Error ? error.name : "UnknownError",
          errorMessage: error instanceof Error ? error.message : "Unknown Google authentication error",
        },
        "Google sign-in failed",
      );
      const code = stage.replace(" ", "_");
      return reply.redirect(authReturnUrl(`google_${code}_failed`));
    }
  });

  app.get("/api/auth/session", { preHandler: requireAuth }, async (request) => ({
    user: request.user,
  }));

  app.post("/api/auth/logout", async (_request, reply) => {
    reply.clearCookie("lunajoy_session", { path: "/" });
    return reply.code(204).send();
  });
}
