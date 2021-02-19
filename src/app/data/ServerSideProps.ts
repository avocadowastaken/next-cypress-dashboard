import { JWT_SECRET } from "@/api/env";
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
  try {
    const session = await getToken({
      secret: JWT_SECRET,
      req: context.req as NextApiRequest,
    });

    return { userId: session["sub"] };
  } catch {
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

export async function getRequestBody(
  context: GetServerSidePropsContext
): Promise<URLSearchParams> {
  const body = await getRawBody(context.req, { encoding: "utf8" });

  return new URLSearchParams(body);
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

    return fn(session, context);
  };
}
