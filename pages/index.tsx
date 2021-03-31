import { getSSPSession } from "@/lib/Session";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<unknown>> {
  try {
    await getSSPSession(ctx);

    return { redirect: { permanent: false, destination: "/projects" } };
  } catch {
    return { redirect: { permanent: false, destination: "/home" } };
  }
}

export default function IndexPage(): null {
  return null;
}
