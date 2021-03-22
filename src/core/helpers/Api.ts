import { AppError, getAppErrorStatusCode } from "@/core/data/AppError";
import {
  JWT_ENCRYPTION_KEY,
  JWT_SECRET,
  JWT_SIGNING_KEY,
} from "@/core/helpers/env";
import morgan from "morgan";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import nc, { NextConnect } from "next-connect";

interface RequestSession {
  userId: string;
}

export async function getRequestSession(
  req: NextApiRequest
): Promise<RequestSession> {
  try {
    const session = await getToken({
      req,
      secret: JWT_SECRET,
      signingKey: JWT_SIGNING_KEY,
      encryptionKey: JWT_ENCRYPTION_KEY,
    });

    const userId = session?.["sub"];

    if (userId) {
      return { userId };
    }
  } catch {}

  throw new AppError("UNAUTHORIZED");
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
  }).use(morgan("tiny"));

  setup(app);

  return app;
}
