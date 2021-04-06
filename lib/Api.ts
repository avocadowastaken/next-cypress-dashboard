import { AppError, getAppErrorStatusCode } from "@/lib/AppError";
import { sessionMiddleware } from "@/lib/Session";
import { randomBytes } from "crypto";
import morgan from "morgan";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import nc, { NextConnect } from "next-connect";

export function createApiHandler(
  setup: (app: NextConnect<NextApiRequest, NextApiResponse>) => void
): NextApiHandler {
  const app = nc<NextApiRequest, NextApiResponse>({
    attachParams: true,
    onError(error, _, res) {
      if (error.name === "NotFoundError") {
        error = new AppError("NOT_FOUND");
      }

      console.error(error);

      res.status(getAppErrorStatusCode(error)).send({
        name: error.name,
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
      });
    },
  });

  app.use(morgan("tiny"));
  app.use(sessionMiddleware());

  app.use((req, _, next) => {
    const csrfToken = req.session.get("csrf-token");

    if (!csrfToken) {
      req.session.set("csrf-token", randomBytes(16).toString("hex"));
    }

    next();
  });

  setup(app);

  return app;
}
