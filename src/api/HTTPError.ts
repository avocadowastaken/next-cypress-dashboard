import createError from "fastify-error";

//
// 400
//

export const BadRequestError = createError(
  "BAD_REQUEST",
  "Bad Request (%s)",
  401
);
export const ValidationError = createError("VALIDATION_ERROR", "'%s' %s", 401);

//
// 401
//

export const UnauthorizedError = createError(
  "UNAUTHORIZED",
  "Unauthorized (%s)",
  401
);

//
// 403
//

export const ForbiddenError = createError("FORBIDDEN", "Forbidden", 403);
