import "@fastify/jwt";

export type SessionUser = {
  id: number;
  email: string;
  name: string;
  avatarUrl: string | null;
};

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: SessionUser;
    user: SessionUser;
  }
}
