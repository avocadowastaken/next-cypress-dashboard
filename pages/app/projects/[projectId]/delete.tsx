import { prisma } from "@/api/db";
import { AppTitle } from "@/app/AppLayout";
import { createServerSideProps } from "@/app/data/ServerSideProps";
import {
  Alert,
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

interface DeleteProjectPageProps {
  error?: string;
  project: Project;
  removed?: boolean;
}

export const getServerSideProps = createServerSideProps<
  DeleteProjectPageProps,
  { projectId: string }
>(async ({ userId }, { query, params }) => {
  const projectId = params?.projectId;

  if (projectId) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, users: { some: { id: userId } } },
    });

    if (project) {
      const deleteConfirmation = query.confirmation;

      if (typeof deleteConfirmation == "string") {
        try {
          const expectedName = `${project.org}/${project.repo}`;

          if (deleteConfirmation != expectedName) {
            throw new Error(`Please type ${expectedName} to confirm.`);
          }

          await prisma.project.update({
            where: { id: projectId },
            data: { users: { disconnect: { id: userId } } },
          });

          return { props: { project, removed: true } };
        } catch (error) {
          return {
            props: {
              project,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to remove a project",
            },
          };
        }
      }

      return { props: { project } };
    }
  }

  return { redirect: { permanent: false, destination: "/app/projects" } };
});

export default function DeleteProjectPage({
  error,
  project,
  removed,
}: DeleteProjectPageProps) {
  return (
    <Dialog open={true}>
      <AppTitle
        breadcrumbs={[
          "Projects",
          project.providerId,
          project.org,
          project.repo,
        ]}
      />

      {removed ? (
        <Alert
          action={
            <NextLink replace={true} passHref={true} href="/app/projects">
              <Button color="inherit">Close</Button>
            </NextLink>
          }
        >
          {project.org}/{project.repo} removed
        </Alert>
      ) : (
        <form>
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
                  error={!!error}
                  helperText={error}
                  name="confirmation"
                  label="Please type project name"
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <NextLink
              replace={true}
              passHref={true}
              href={`/app/projects/${project.id}`}
            >
              <Button>Dismiss</Button>
            </NextLink>

            <Button type="submit">Confirm</Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
}
