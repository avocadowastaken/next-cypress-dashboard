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
// 400
//

export class BadRequestError extends HTTPError {
  constructor(ctx: Record<string, string>) {
    super(400, "Bad Request", ctx);
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
