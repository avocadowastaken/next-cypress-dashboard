import {
  JWT_ENCRYPTION_KEY,
  JWT_SECRET,
  JWT_SIGNING_KEY,
} from "@/core/helpers/env";
import debug from "debug";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiRequest,
} from "next";
import { getToken } from "next-auth/jwt";
import { ParsedUrlQuery } from "querystring";
import getRawBody from "raw-body";

interface UserSession {
  userId: string;
}

const sspJWTLogger = debug("app:ssp:jwt");

async function getUserSession(
  context: GetServerSidePropsContext
): Promise<null | UserSession> {
  sspJWTLogger("parsing token");

  try {
    const session = await getToken({
      secret: JWT_SECRET,
      signingKey: JWT_SIGNING_KEY,
      encryptionKey: JWT_ENCRYPTION_KEY,
      req: context.req as NextApiRequest,
    });

    sspJWTLogger("access granted");
    return { userId: session["sub"] };
  } catch {
    sspJWTLogger("access denied");

    return null;
  }
}

export function redirectToSignIn<TProps>(
  context: GetServerSidePropsContext
): GetServerSidePropsResult<TProps> {
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const callbackUrl = encodeURIComponent(
    `${protocol}://${context.req.headers.host}${context.resolvedUrl}`
  );

  return {
    redirect: {
      statusCode: 307,
      destination: `/api/auth/signin?callbackUrl=${callbackUrl}`,
    },
  };
}

const sspBodyLogger = debug("app:ssp:body");

export async function getRequestBody(
  context: GetServerSidePropsContext
): Promise<URLSearchParams> {
  sspBodyLogger("starting parsing");

  const body = await getRawBody(context.req, { encoding: "utf8" });
  const params = new URLSearchParams(body);

  sspBodyLogger("parsing finished");

  return params;
}

const sspLogger = debug("app:ssp");

export function createServerSideProps<
  TProps,
  TParams extends ParsedUrlQuery = ParsedUrlQuery
>(
  fn: (
    session: UserSession,
    context: GetServerSidePropsContext<TParams>
  ) =>
    | GetServerSidePropsResult<TProps>
    | Promise<GetServerSidePropsResult<TProps>>
): GetServerSideProps<TProps, TParams> {
  return async (context) => {
    const session = await getUserSession(context);

    if (!session) {
      return redirectToSignIn(context);
    }

    sspLogger("getting server side props");

    const response = await fn(session, context);

    sspLogger("sending server side props to the client");

    return response;
  };
}
