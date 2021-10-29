import { GetServerSidePropsContext, NextApiRequest } from "next";
import {
  applySession,
  ironSession,
  Session,
  SessionOptions,
} from "next-iron-session";
import { AppError } from "./AppError";
import { SESSION_COOKIE_NAME, SESSION_SECRET } from "./env";

declare module "next" {
  export interface NextApiRequest {
    session: Session;
  }
}

const sessionOptions: SessionOptions = {
  password: SESSION_SECRET,
  cookieName: SESSION_COOKIE_NAME,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export function sessionMiddleware() {
  return ironSession(sessionOptions);
}

interface RequestSession {
  userId: string;
}

export async function getSSPSession({
  req,
  res,
}: GetServerSidePropsContext): Promise<RequestSession> {
  await applySession(req, res, sessionOptions);
  return getRequestSession(req as NextApiRequest);
}

export function getRequestSession(req: NextApiRequest): RequestSession {
  const userId = req.session.get("userId");
  if (!userId) throw new AppError("UNAUTHORIZED");
  return { userId };
}
