import fastify, { FastifyInstance, HTTPMethods } from "fastify";
import { NextApiHandler } from "next";
import pino from "pino";

export function createApiHandler(
  setup: (app: FastifyInstance) => void
): NextApiHandler {
  const app = fastify({
    logger: pino({
      prettyPrint: {},
      prettifier: require("pino-colada"),
    }),
  });

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
