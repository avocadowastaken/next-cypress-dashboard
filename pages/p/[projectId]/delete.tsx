import { prisma } from "@/api/db";
import {
  createServerSideProps,
  getRequestBody,
  redirectToSignIn,
} from "@/app/data/ServerSideProps";
import {
  AppErrorCode,
  extractErrorCode,
  formatErrorCode,
} from "@/shared/AppError";
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

interface DeleteProjectPageProps {
  project: Project;
  csrfToken: string;
  errorCode?: AppErrorCode;
}

export const getServerSideProps = createServerSideProps<
  DeleteProjectPageProps,
  { projectId: string }
>(async ({ userId }, context) => {
  const csrfToken = await getCsrfToken(context);

  if (!csrfToken) {
    return redirectToSignIn(context);
  }

  const projectId = context.params?.projectId;

  if (projectId) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, users: { some: { id: userId } } },
    });

    if (project) {
      const props: DeleteProjectPageProps = { project, csrfToken };

      if (context.req.method === "POST") {
        const body = await getRequestBody(context);
        const projectName = `${project.org}/${project.repo}`;

        if (body.get("confirmation") !== projectName) {
          return { props: { ...props, errorCode: "BAD_REQUEST" } };
        }

        if (body.get("csrfToken") !== csrfToken) {
          return redirectToSignIn(context);
        }

        try {
          await prisma.project.update({
            select: null,
            where: { id: projectId },
            data: { users: { disconnect: { id: userId } } },
          });

          return {
            redirect: {
              permanent: false,
              destination: `/p?success=${encodeURIComponent(
                `${projectName} removed`
              )}`,
            },
          };
        } catch (error) {
          return { props: { ...props, errorCode: extractErrorCode(error) } };
        }
      }

      return { props };
    }
  }

  return { notFound: true };
});

export default function DeleteProjectPage({
  project,
  csrfToken,
  errorCode,
}: DeleteProjectPageProps) {
  return (
    <Dialog open={true}>
      <AppTitle breadcrumbs={["Projects", `${project.org}/${project.repo}`]} />

      <form method="POST">
        <input type="hidden" name="csrfToken" value={csrfToken} />

        <DialogContent>
          <Grid container={true} spacing={2}>
            <Grid item={true} xs={12}>
              This action cannot be undone. This will permanently revoke your
              access to the{" "}
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
                error={!!errorCode}
                name="confirmation"
                label="Type project name to confirm"
                helperText={
                  errorCode === "BAD_REQUEST"
                    ? "Invalid project name"
                    : errorCode && formatErrorCode(errorCode)
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
