import { NextApiRequest } from "next";
import { APP_ENV, NODE_ENV } from "/api/env";

function defineErrorProperties(
  error: Error,
  name = error.name,
  message = error.message
): void {
  Object.defineProperty(error, "name", {
    value: name,
    writable: true,
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(error, "message", {
    value: message,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}

export interface HTTPErrorContext {
  [key: string]: unknown;
}

export class HTTPError<
  TContext extends HTTPErrorContext = HTTPErrorContext
> extends Error {
  status: number;
  context: TContext;

  constructor(status: number, message: string, context: TContext) {
    super(message);

    this.status = status;
    this.context = context;

    defineErrorProperties(this, this.constructor.name);
  }
}

//
// 403
//

export class ForbiddenError extends HTTPError {
  constructor() {
    super(403, "Forbidden", {});
  }
}

//
// 404
//

export class RouteNotFoundError extends HTTPError<
  Pick<NextApiRequest, "url" | "method">
> {
  constructor({ url, method }: NextApiRequest) {
    super(404, "Not Found", { url, method });
  }
}

export class ResourceNotFoundError extends HTTPError {
  constructor(message: string, context: HTTPErrorContext) {
    super(404, message, context);
  }
}

//
// 405
//

export class MethodNotAllowedError extends HTTPError {
  constructor(method?: string) {
    super(405, "Method Not Allowed", { method });
  }
}

//
// 500
//

export interface InternalServerErrorContext extends HTTPErrorContext {
  cause?: Error;
}

export class InternalServerError extends HTTPError<InternalServerErrorContext> {
  constructor(cause: unknown) {
    const context: InternalServerErrorContext = {};

    if (NODE_ENV !== "production" || APP_ENV === "preview") {
      context.cause =
        cause instanceof Error ? cause : new Error("Unknown cause");

      defineErrorProperties(context.cause);
    }

    super(500, "Internal Server Error", context);
  }
}
