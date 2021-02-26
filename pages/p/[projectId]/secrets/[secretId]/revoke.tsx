import { prisma } from "@/api/db";
import { verifyGitHubRepoAccess } from "@/api/GitHubClient";
import {
  createServerSideProps,
  getRequestBody,
  redirectToSignIn,
} from "@/app/data/ServerSideProps";
import { AppErrorCode, formatErrorCode } from "@/shared/AppError";
import { AppTitle } from "@/ui/AppLayout";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { Project } from "@prisma/client";
import { getCsrfToken } from "next-auth/client";
import NextLink from "next/link";

interface RevokeProjectSecretsKeyProps {
  project: Project;
  csrfToken: string;
  error?: AppErrorCode;
}

export const getServerSideProps = createServerSideProps<
  RevokeProjectSecretsKeyProps,
  { secretId: string; projectId: string }
>(async ({ userId }, context) => {
  const csrfToken = await getCsrfToken(context);
  if (!csrfToken) return redirectToSignIn(context);

  const { secretId, projectId } = context.params || {};
  if (!secretId || !projectId) return { notFound: true };

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      secrets: { id: secretId },
      users: { some: { id: userId } },
    },
  });

  if (!project) return { notFound: true };

  const settingsUrl = `/p/${project.id}/settings`;

  try {
    await verifyGitHubRepoAccess(userId, project.org, project.repo);
  } catch {
    return { redirect: { permanent: false, destination: settingsUrl } };
  }

  const props: RevokeProjectSecretsKeyProps = { project, csrfToken };

  if (context.req.method === "POST") {
    const body = await getRequestBody(context);

    if (body.get("confirmation") !== `${project.org}/${project.repo}`) {
      return { props: { ...props, error: "BAD_REQUEST" } };
    }

    if (body.get("csrfToken") !== csrfToken) {
      return redirectToSignIn(context);
    }

    try {
      await prisma.projectSecrets.delete({
        select: null,
        where: { id: secretId },
      });

      await prisma.projectSecrets.create({
        select: null,
        data: { projectId },
      });
    } catch {
      return { redirect: { permanent: false, destination: settingsUrl } };
    }

    return { redirect: { permanent: true, destination: settingsUrl } };
  }

  return { props };
});

export default function RevokeProjectSecrets({
  error,
  project,
  csrfToken,
}: RevokeProjectSecretsKeyProps) {
  return (
    <Dialog open={true}>
      <AppTitle
        breadcrumbs={[
          "Projects",
          `${project.org}/${project.repo}`,
          "Secrets",
          "Revoke",
        ]}
      />

      <form method="POST">
        <input type="hidden" name="csrfToken" value={csrfToken} />

        <DialogContent>
          <Grid container={true} spacing={2}>
            <Grid item={true} xs={12}>
              This action cannot be undone. This will permanently revoke access
              for the current record key to the{" "}
              <Typography color="primary">
                {project.org}/{project.repo}
              </Typography>{" "}
              project.
            </Grid>

            <Grid item={true} xs={12}>
              <TextField
                required={true}
                autoFocus={true}
                fullWidth={true}
                error={!!error}
                name="confirmation"
                label="Type project name to confirm"
                helperText={
                  error === "BAD_REQUEST"
                    ? "Invalid project name"
                    : error && formatErrorCode(error)
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <NextLink
            replace={true}
            passHref={true}
            href={`/p/${project.id}/settings`}
          >
            <Button>Dismiss</Button>
          </NextLink>

          <Button type="submit">Confirm</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
