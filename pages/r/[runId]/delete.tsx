import { AppTitle } from "@/core/components/AppLayout";
import { prisma } from "@/core/helpers/db";
import { verifyGitHubRepoAccess } from "@/core/helpers/GitHub";
import {
  createServerSideProps,
  getRequestBody,
  redirectToSignIn,
} from "@/core/ServerSideProps";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import { Project, Run } from "@prisma/client";
import { getCsrfToken } from "next-auth/client";
import NextLink from "next/link";

interface DeleteRunPageProps {
  csrfToken: string;
  run: Run & { project: Project };
}

export const getServerSideProps = createServerSideProps<
  DeleteRunPageProps,
  { runId: string }
>(async ({ userId }, context) => {
  const csrfToken = await getCsrfToken(context);

  if (!csrfToken) {
    return redirectToSignIn(context);
  }

  const runId = context.params?.runId;

  if (runId) {
    const run = await prisma.run.findFirst({
      include: { project: true },
      where: { id: runId, project: { users: { some: { id: userId } } } },
    });

    if (run) {
      try {
        await verifyGitHubRepoAccess(userId, run.project.org, run.project.repo);
      } catch {
        return redirectToSignIn(context);
      }

      if (context.req.method !== "POST") {
        return { props: { run, csrfToken } };
      }

      const body = await getRequestBody(context);

      if (body.get("csrfToken") !== csrfToken) {
        return redirectToSignIn(context);
      }

      await prisma.testResult.deleteMany({ where: { runInstance: { runId } } });
      await prisma.runInstance.deleteMany({ where: { runId } });
      await prisma.run.deleteMany({ where: { id: runId } });

      return {
        redirect: {
          permanent: true,
          destination: `/p/${run.projectId}/?success=${encodeURIComponent(
            `"${run.ciBuildId}" run removed`
          )}`,
        },
      };
    }
  }

  return { notFound: true };
});

export default function DeleteRunPage({ run, csrfToken }: DeleteRunPageProps) {
  return (
    <Dialog open={true}>
      <AppTitle
        breadcrumbs={[
          "Projects",
          `${run.project.org}/${run.project.repo}`,
          run.commitMessage || run.ciBuildId,
        ]}
      />

      <form method="POST">
        <input type="hidden" name="csrfToken" value={csrfToken} />

        <DialogContent>
          This action cannot be undone. This will permanently remove test run,
          run instances and test results. Running tests associated with the run
          will fail.
        </DialogContent>

        <DialogActions>
          <NextLink replace={true} passHref={true} href={`/r/${run.id}`}>
            <Button>Dismiss</Button>
          </NextLink>

          <Button type="submit">Confirm</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
