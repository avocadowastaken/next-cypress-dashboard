import { getSSPSession } from "@/core/helpers/Session";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<unknown>> {
  const session = await getSSPSession(ctx);

  return !session.userId
    ? { redirect: { permanent: false, destination: "/home" } }
    : { redirect: { permanent: false, destination: "/projects" } };
}

export default function IndexPage(): null {
  return null;
}
