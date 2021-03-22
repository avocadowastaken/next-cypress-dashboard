import { AppError, getAppErrorStatusCode } from "@/core/data/AppError";
import { SESSION_SECRET } from "@/core/helpers/env";
import { randomBytes } from "crypto";
import morgan from "morgan";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import nc, { NextConnect } from "next-connect";
import { ironSession, Session } from "next-iron-session";

declare module "next" {
  export interface NextApiRequest {
    session: Session;
  }
}

interface RequestSession {
  userId: string;
}

export function getRequestSession(req: NextApiRequest): RequestSession {
  const userId = req.session.get("userId");

  if (!userId) {
    throw new AppError("UNAUTHORIZED");
  }

  return { userId };
}

export function createApiHandler(
  setup: (app: NextConnect<NextApiRequest, NextApiResponse>) => void
): NextApiHandler {
  const app = nc<NextApiRequest, NextApiResponse>({
    attachParams: true,
    onError(error, _, res) {
      if (error.name === "NotFoundError") {
        error = new AppError("NOT_FOUND");
      }

      res.status(getAppErrorStatusCode(error)).send({
        name: error.name,
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
      });
    },
  });

  app.use(morgan("tiny"));
  app.use(
    ironSession({
      cookieName: "__nis",
      password: SESSION_SECRET,
      cookieOptions: {
        secure: process.env.NODE_ENV === "production",
      },
    })
  );

  app.use((req, _, next) => {
    const csrfToken = req.session.get("csrf-token");

    if (!csrfToken) {
      req.session.set("csrf-token", randomBytes(16).toString("hex"));
    }

    next();
  });

  setup(app);

  return app;
}
