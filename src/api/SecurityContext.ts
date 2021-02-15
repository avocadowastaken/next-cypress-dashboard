import { prisma } from "@/api/db";
import { User } from "@prisma/client";
import { parse as parseCookie } from "cookie";
import { IncomingHttpHeaders, IncomingMessage } from "http";
import { UnauthorizedError } from "./HTTPError";

export const SESSION_TOKEN_COOKIE = "ncd.auth.session-token";

function parseSessionTokenCookie({
  cookie,
}: IncomingHttpHeaders): null | string {
  if (cookie) {
    const { [SESSION_TOKEN_COOKIE]: sessionToken } = parseCookie(cookie);

    if (sessionToken) {
      return sessionToken;
    }
  }

  return null;
}

export class SecurityContext {
  protected static cache = new WeakMap<IncomingMessage, SecurityContext>();

  static async create(req: IncomingMessage): Promise<SecurityContext> {
    let ctx = this.cache.get(req);

    if (!ctx) {
      const sessionToken = parseSessionTokenCookie(req.headers);

      if (!sessionToken) {
        throw new UnauthorizedError("Empty token");
      }

      const userSession = await prisma.userSession.findUnique({
        where: { sessionToken },
        include: { user: true },
      });

      if (!userSession) {
        throw new UnauthorizedError("Invalid token");
      }

      if (userSession.expires < new Date()) {
        throw new UnauthorizedError("Expired token");
      }

      ctx = new SecurityContext(userSession.user);
      this.cache.set(req, ctx);
    }

    return ctx;
  }

  readonly user: User;

  constructor(user: User) {
    this.user = user;
  }
}
