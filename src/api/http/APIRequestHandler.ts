import { MethodNotAllowedError } from "@/api/http/HTTPError";
import { createRequestHandler } from "@/api/http/RequestHandler";
import { NextApiHandler, NextApiRequest } from "next";
import { NextApiResponse } from "next/dist/next-server/lib/utils";

function handleNotAllowedMethod(req: NextApiRequest): void {
  throw new MethodNotAllowedError(req.method);
}

export declare type APIRequestHandler<T> = (
  req: NextApiRequest,
  res: NextApiResponse<T>
) => void | T | Promise<void | T>;

export interface APIRequestHandlerOptions<TGet, TPut, TPost, TDelete> {
  get?: APIRequestHandler<TGet>;
  put?: APIRequestHandler<TPut>;
  post?: APIRequestHandler<TPost>;
  delete?: APIRequestHandler<TDelete>;
}

export function createAPIRequestHandler<TGet, TPut, TPost, TDelete>({
  get: handleGET = handleNotAllowedMethod,
  put: handlePUT = handleNotAllowedMethod,
  post: handlePOST = handleNotAllowedMethod,
  delete: handleDELETE = handleNotAllowedMethod,
}: APIRequestHandlerOptions<TGet, TPut, TPost, TDelete>): NextApiHandler {
  return createRequestHandler(async (req, res) => {
    const handler =
      req.method === "GET"
        ? handleGET
        : req.method === "PUT"
        ? handlePUT
        : req.method === "POST"
        ? handlePOST
        : req.method === "DELETE"
        ? handleDELETE
        : handleNotAllowedMethod;

    const result = await handler(req, res);

    if (result != null) {
      res.json(result);
    }
  });
}
