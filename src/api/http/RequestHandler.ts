import { HTTPError, InternalServerError } from "@/api/http/HTTPError";
import { ServerRequestContext } from "@/api/http/ServerRequestContext";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

function toHTTPError(error: unknown): HTTPError {
  return error instanceof HTTPError ? error : new InternalServerError(error);
}

export type RequestHandler<T> = (
  req: NextApiRequest,
  res: NextApiResponse<T>,
  ctx: ServerRequestContext
) => void | Promise<void>;

export function createRequestHandler<T>(
  handler: RequestHandler<T>
): NextApiHandler {
  return async (req, res) => {
    const ctx = await ServerRequestContext.resolve(req);

    console.info("%s %s", req.method, req.url);

    try {
      await handler(req, res, ctx);
    } catch (error: unknown) {
      const httpError = toHTTPError(error);

      console.error(
        "%s %s > %s %s %s",
        req.method,
        req.url,
        httpError.name,
        httpError.status,
        httpError.stack
      );

      if (httpError instanceof InternalServerError && httpError.context.cause) {
        console.error(httpError.context.cause);
      }

      res.status(httpError.status).json(httpError);
    }
  };
}
