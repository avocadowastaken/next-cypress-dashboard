import { RouteNotFoundError } from "@/api/http/HTTPError";
import { createRequestHandler } from "@/api/http/RequestHandler";

export default createRequestHandler(async (req) => {
  throw new RouteNotFoundError(req);
});
