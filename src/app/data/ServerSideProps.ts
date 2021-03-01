import { JWT_ENCRYPTION_KEY, JWT_SECRET, JWT_SIGNING_KEY } from "@/api/env";
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

async function getUserSession(
  context: GetServerSidePropsContext
): Promise<null | UserSession> {
  console.time("Validating token");

  try {
    const session = await getToken({
      secret: JWT_SECRET,
      signingKey: JWT_SIGNING_KEY,
      encryptionKey: JWT_ENCRYPTION_KEY,
      req: context.req as NextApiRequest,
    });

    return { userId: session["sub"] };
  } catch {
    return null;
  } finally {
    console.timeEnd("Validating token");
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

export async function getRequestBody(
  context: GetServerSidePropsContext
): Promise<URLSearchParams> {
  console.time("Parsing request body");

  const body = await getRawBody(context.req, { encoding: "utf8" });
  const params = new URLSearchParams(body);

  console.timeEnd("Parsing request body");

  return params;
}

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

    console.time("Collecting server side props");

    const response = await fn(session, context);

    console.timeEnd("Collecting server side props");

    return response;
  };
}
