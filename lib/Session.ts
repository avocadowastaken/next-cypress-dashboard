import { SESSION_SECRET } from "@/core/env";
import { AppError } from "@/lib/AppError";
import { GetServerSidePropsContext, NextApiRequest } from "next";
import {
  applySession,
  ironSession,
  Session,
  SessionOptions,
} from "next-iron-session";

declare module "next" {
  export interface NextApiRequest {
    session: Session;
  }
}

const sessionOptions: SessionOptions = {
  cookieName: "__nis",
  password: SESSION_SECRET,
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

  if (!userId) {
    throw new AppError("UNAUTHORIZED");
  }

  return { userId };
}
