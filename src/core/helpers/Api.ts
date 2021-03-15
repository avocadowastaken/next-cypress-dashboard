import { createAppError } from "@/core/data/AppError";
import {
  JWT_ENCRYPTION_KEY,
  JWT_SECRET,
  JWT_SIGNING_KEY,
} from "@/core/helpers/env";
import fastify, { FastifyInstance, FastifyRequest, HTTPMethods } from "fastify";
import { fastifyCookie } from "fastify-cookie";
import { NextApiHandler } from "next";
import { getToken } from "next-auth/jwt";
import pino from "pino";

interface RequestSession {
  userId: string;
}

export async function getRequestSession(
  request: FastifyRequest
): Promise<RequestSession> {
  try {
    const session = await getToken({
      req: request as any,
      secret: JWT_SECRET,
      signingKey: JWT_SIGNING_KEY,
      encryptionKey: JWT_ENCRYPTION_KEY,
    });

    const userId = session?.["sub"];

    if (userId) {
      return { userId };
    }
  } catch {}

  throw createAppError("UNAUTHORIZED");
}

export function createApiHandler(
  setup: (app: FastifyInstance) => void
): NextApiHandler {
  const app = fastify({
    logger: pino({
      prettyPrint: {},
      prettifier: require("pino-colada"),
    }),
  });

  app.register(fastifyCookie);

  setup(app);

  return async (req, res) => {
    const { "content-length": contentLength, ...requestHeaders } = req.headers;

    const { statusCode, body, headers } = await app.inject({
      url: req.url,
      query: req.query,
      payload: req.body,
      cookies: req.cookies,
      headers: requestHeaders,
      method: req.method as HTTPMethods,
    });

    res.status(statusCode);

    for (const [name, value] of Object.entries(headers)) {
      if (value) {
        res.setHeader(name, value);
      }
    }

    res.send(body);
  };
}
