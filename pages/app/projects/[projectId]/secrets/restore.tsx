import { prisma } from "@/api/db";
import { createProjectRecordKey } from "@/api/ProjectService";
import { createServerSideProps } from "@/app/data/ServerSideProps";

export const getServerSideProps = createServerSideProps<
  unknown,
  { projectId: string }
>(async ({ userId }, { req, params }) => {
  const projectId = params?.projectId;

  if (projectId) {
    try {
      const recordKey = await createProjectRecordKey();

      await prisma.projectSecrets.create({
        select: null,
        data: { projectId, recordKey },
      });
    } catch {}

    return {
      redirect: {
        permanent: false,
        destination: req.headers.referer || `/app/projects/${projectId}`,
      },
    };
  }

  return { notFound: true };
});

export default function RevokeProjectSecret(): null {
  return null;
}
