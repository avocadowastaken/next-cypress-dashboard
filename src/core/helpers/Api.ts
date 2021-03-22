import { AppError } from "@/core/data/AppError";
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
  const app = nc({ attachParams: true }).use(morgan("tiny"));

  setup(app);

  // const app = fastify({
  //   logger: pino({
  //     prettyPrint: {},
  //     prettifier: require("pino-colada"),
  //   }),
  // });
  //
  // app.register(fastifyCookie);
  //
  // app.setErrorHandler((error, _, reply) => {
  //   if (error.name === "NotFoundError") {
  //     reply.status(404).send(new AppError("NOT_FOUND"));
  //   }
  //
  //   reply.status(error.statusCode || 500).send(error);
  // });
  //
  //
  // return async (req, res) => {
  //   const { "content-length": contentLength, ...requestHeaders } = req.headers;
  //
  //   const { statusCode, body, headers } = await app.inject({
  //     url: req.url,
  //     query: req.query,
  //     payload: req.body,
  //     cookies: req.cookies,
  //     headers: requestHeaders,
  //     method: req.method as HTTPMethods,
  //   });
  //
  //   res.status(statusCode);
  //
  //   for (const [name, value] of Object.entries(headers)) {
  //     if (value) {
  //       res.setHeader(name, value);
  //     }
  //   }
  //
  //   res.send(body);
  // };
  return app;
}
