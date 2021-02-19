import { prisma } from "@/api/db";
import {
  createServerSideProps,
  getRequestBody,
  redirectToSignIn,
} from "@/app/data/ServerSideProps";
import { getCsrfToken } from "next-auth/client";

export const getServerSideProps = createServerSideProps<
  unknown,
  { projectId: string }
>(async ({ userId }, context) => {
  const projectId = context.params?.projectId;

  if (!projectId) {
    return { notFound: true };
  }

  const csrfToken = await getCsrfToken(context);

  if (!csrfToken) {
    return redirectToSignIn(context);
  }

  if (context.req.method === "POST") {
    const body = await getRequestBody(context);

    if (body.get("csrfToken") === csrfToken) {
      try {
        await prisma.projectSecrets.create({
          select: null,
          data: { projectId },
        });
      } catch {}
    }
  }

  return {
    redirect: {
      permanent: false,
      destination: context.req.headers.referer || `/p/${projectId}/settings`,
    },
  };
});

export default function GenerateProjectSecrets(): null {
  return null;
}
