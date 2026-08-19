import path from "node:path";
import { fileURLToPath } from "node:url";
import Fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import oauthPlugin from "@fastify/oauth2";
import websocket from "@fastify/websocket";
import fastifyStatic from "@fastify/static";
import { config } from "./config.js";
import "./db.js";
import "./types.js";
import { authRoutes } from "./routes/auth.js";
import { logRoutes } from "./routes/logs.js";

declare module "fastify" {
  interface FastifyInstance {
    broadcastLogUpdate(userId: number, log: unknown): void;
  }
}

const app = Fastify({ logger: true });
const sockets = new Map<number, Set<WebSocket>>();

await app.register(cors, { origin: config.webOrigin, credentials: true });
await app.register(cookie);
await app.register(jwt, {
  secret: config.jwtSecret,
  cookie: { cookieName: "lunajoy_session", signed: false },
});
await app.register(websocket);

if (config.googleEnabled) {
  await app.register(oauthPlugin, {
    name: "oauth2Google",
    scope: ["openid", "profile", "email"],
    credentials: {
      client: { id: config.googleClientId, secret: config.googleClientSecret },
      auth: {
        tokenHost: "https://oauth2.googleapis.com",
        tokenPath: "/token",
        authorizeHost: "https://accounts.google.com",
        authorizePath: "/o/oauth2/v2/auth",
      },
    },
    startRedirectPath: "/api/auth/google",
    callbackUri: config.googleCallbackUrl,
    pkce: "S256",
    hostPrefixedCookies: true,
  });
} else {
  app.get("/api/auth/google", async (_request, reply) => reply.redirect(`${config.webOrigin}/?authError=google_not_configured`));
}

app.decorate("broadcastLogUpdate", (userId: number, log: unknown) => {
  for (const socket of sockets.get(userId) ?? []) {
    if (socket.readyState === socket.OPEN) socket.send(JSON.stringify({ type: "log.updated", log }));
  }
});

app.get("/api/updates", { websocket: true }, async (socket, request) => {
  try {
    await request.jwtVerify();
    const userSockets = sockets.get(request.user.id) ?? new Set<WebSocket>();
    userSockets.add(socket);
    sockets.set(request.user.id, userSockets);
    socket.send(JSON.stringify({ type: "connected" }));
    socket.on("close", () => {
      userSockets.delete(socket);
      if (!userSockets.size) sockets.delete(request.user.id);
    });
  } catch {
    socket.close(1008, "Unauthorized");
  }
});

await app.register(authRoutes);
await app.register(logRoutes);

if (config.production) {
  const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
  const clientRoot = path.resolve(currentDirectory, "../../client/dist");
  await app.register(fastifyStatic, { root: clientRoot });
  app.setNotFoundHandler((request, reply) => {
    if (request.raw.url?.startsWith("/api/")) return reply.code(404).send({ message: "Not found" });
    return reply.sendFile("index.html");
  });
}

app.setErrorHandler((error, _request, reply) => {
  app.log.error(error);
  const statusCode = typeof error === "object" && error && "statusCode" in error && typeof error.statusCode === "number" ? error.statusCode : 500;
  const message = error instanceof Error && statusCode < 500 ? error.message : "Something went wrong.";
  reply.code(statusCode).send({ message });
});

await app.listen({ port: config.port, host: config.host });
