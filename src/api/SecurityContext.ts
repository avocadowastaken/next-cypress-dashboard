import { env } from "@/api/env";
import { parse as parseCookie } from "cookie";
import { IncomingHttpHeaders, IncomingMessage } from "http";
import { decode } from "next-auth/jwt";
import { UnauthorizedError } from "./HTTPError";

export const SESSION_TOKEN_COOKIE = "ncd.auth.session-token";

async function parseJWT({
  cookie,
}: IncomingHttpHeaders): Promise<null | { sub: string }> {
  if (cookie) {
    const { [SESSION_TOKEN_COOKIE]: token } = parseCookie(cookie);

    if (token) {
      const session = await decode({
        token,
        secret: env("JWT_SECRET"),
      });

      return { sub: session["sub"] };
    }
  }

  return null;
}

export class SecurityContext {
  protected static cache = new WeakMap<IncomingMessage, SecurityContext>();

  static async create(req: IncomingMessage): Promise<SecurityContext> {
    let ctx = this.cache.get(req);

    if (!ctx) {
      const session = await parseJWT(req.headers);

      if (!session) {
        throw new UnauthorizedError("Empty token");
      }

      ctx = new SecurityContext(session.sub);

      this.cache.set(req, ctx);
    }

    return ctx;
  }

  readonly userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }
}
