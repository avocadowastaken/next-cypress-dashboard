import { HTTPError, InternalServerError } from "@/api/http/HTTPError";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

function toHTTPError(error: unknown): HTTPError {
  return error instanceof HTTPError ? error : new InternalServerError(error);
}

export type RequestHandler<T> = (
  req: NextApiRequest,
  res: NextApiResponse<T>
) => void | Promise<void>;

async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function handleRequest<T>(
  handler: RequestHandler<T>,
  req: NextApiRequest,
  res: NextApiResponse<T>
): Promise<void> {
  try {
    await handler(req, res);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      // Heroku PostgreSQL connection limit error
      error.message.includes("too many connections for role")
    ) {
      console.error(error);

      await wait(300);

      await handleRequest(handler, req, res);
    } else {
      throw error;
    }
  }
}

export function createRequestHandler<T>(
  handler: RequestHandler<T>
): NextApiHandler {
  return async (req, res) => {
    console.info("%s %s", req.method, req.url);

    try {
      await handleRequest(handler, req, res);
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
