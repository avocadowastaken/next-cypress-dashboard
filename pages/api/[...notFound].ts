import { RouteNotFoundError } from "@s/http/HTTPError";
import { createRequestHandler } from "@s/http/RequestHandler";

export default createRequestHandler(async (req) => {
  throw new RouteNotFoundError(req);
});
