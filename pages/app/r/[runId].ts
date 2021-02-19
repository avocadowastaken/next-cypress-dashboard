import { prisma } from "@/api/db";
import { createServerSideProps } from "@/app/data/ServerSideProps";

export const getServerSideProps = createServerSideProps<
  unknown,
  { runId: string }
>(async ({ userId }, { params }) => {
  const runId = params?.runId;

  if (!runId) {
    return { notFound: true };
  }

  const project = await prisma.project.findFirst({
    select: { id: true },
    rejectOnNotFound: true,
    where: {
      runs: { some: { id: runId } },
      users: { some: { id: userId } },
    },
  });

  return {
    redirect: {
      permanent: true,
      destination: `/app/projects/${project.id}/runs/${runId}`,
    },
  };
});

export default function RunShortUrl() {
  return null;
}
