import { prisma } from "@/api/db";
import { createServerSideProps } from "@/app/data/ServerSideProps";

export const getServerSideProps = createServerSideProps<
  unknown,
  { projectId: string }
>(async ({ userId }, { req, params }) => {
  const projectId = params?.projectId;

  if (projectId) {
    try {
      await prisma.projectSecrets.create({ select: null, data: { projectId } });
    } catch {}

    return {
      redirect: {
        permanent: false,
        destination:
          req.headers.referer || `/app/projects/${projectId}/settings`,
      },
    };
  }

  return { notFound: true };
});

export default function RevokeProjectSecret(): null {
  return null;
}
