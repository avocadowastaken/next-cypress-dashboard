import { prisma } from "@/lib/db";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

export async function getServerSideProps({
  params,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<unknown>> {
  const runId = params?.runId;

  if (runId && typeof runId == "string") {
    try {
      const run = await prisma.run.findUnique({ where: { id: runId } });

      if (run) {
        return {
          redirect: {
            permanent: true,
            destination: `/projects/${run.projectId}/runs/${run.id}`,
          },
        };
      }
    } catch {}
  }

  return { notFound: true };
}

export default function RunShortURL() {
  return null;
}
