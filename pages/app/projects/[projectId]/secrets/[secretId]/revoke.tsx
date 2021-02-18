import { prisma } from "@/api/db";
import { GitHubClient } from "@/api/GitHubClient";
import { createProjectRecordKey } from "@/api/ProjectService";
import { AppTitle } from "@/app/AppLayout";
import { createServerSideProps } from "@/app/data/ServerSideProps";
import { AppErrorCode, formatErrorCode } from "@/shared/AppError";
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
import NextLink from "next/link";

interface RevokeProjectSecretsKeyProps {
  project: Project;
  error?: AppErrorCode;
}

export const getServerSideProps = createServerSideProps<
  RevokeProjectSecretsKeyProps,
  { secretId: string; projectId: string }
>(async ({ userId }, { query, params }) => {
  if (params) {
    const { secretId, projectId } = params;

    const project = await prisma.project.findFirst({
      include: { secrets: true },
      where: {
        id: projectId,
        secrets: { id: secretId },
        users: { some: { id: userId } },
      },
    });

    if (!project) {
      return {
        redirect: {
          permanent: true,
          destination: `/app/projects/${projectId}`,
        },
      };
    }

    try {
      const gitHubClient = await GitHubClient.create(userId);

      await gitHubClient.verifyRepoAccess(project.org, project.repo);
    } catch {
      return {
        redirect: {
          permanent: false,
          destination: `/app/projects/${projectId}/secrets`,
        },
      };
    }

    const deleteConfirmation = query.confirmation;

    if (!deleteConfirmation) {
      return { props: { project } };
    }

    if (deleteConfirmation !== `${project.org}/${project.repo}`) {
      return { props: { project, error: "BAD_REQUEST" } };
    }

    try {
      await prisma.projectSecrets.delete({
        select: null,
        where: { id: secretId },
      });

      const recordKey = await createProjectRecordKey();

      await prisma.projectSecrets.create({
        select: null,
        data: { projectId, recordKey },
      });

      return {
        redirect: {
          permanent: true,
          destination: `/app/projects/${projectId}/secrets`,
        },
      };
    } catch {
      return {
        redirect: {
          permanent: false,
          destination: `/app/projects/${projectId}/secrets`,
        },
      };
    }
  }

  return { redirect: { permanent: false, destination: "/app/projects" } };
});

export default function RevokeProjectSecretsKey({
  error,
  project,
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

      <form>
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
            href={`/app/projects/${project.id}/secrets`}
          >
            <Button>Dismiss</Button>
          </NextLink>

          <Button type="submit">Confirm</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
