import { prisma } from "@/api/db";
import { GitHubClient } from "@/api/GitHubClient";
import { createServerSideProps } from "@/data/ServerSideProps";
import { parseGitUrl } from "@/shared/GitUrl";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from "@material-ui/core";
import { RequestError } from "@octokit/request-error";
import NextLink from "next/link";
import React, { ReactElement } from "react";

interface AddProjectPageProps {
  error?: string;
}

export const getServerSideProps = createServerSideProps<AddProjectPageProps>(
  async ({ userId }, { query }) => {
    const { repo: repoUrl } = query;

    if (repoUrl) {
      try {
        if (typeof repoUrl != "string") {
          throw new Error("Invalid Input");
        }

        const [providerId, org, repo] = parseGitUrl(repoUrl);

        if (!org || !repo) {
          throw new Error("Invalid repository URL");
        }

        const client = await GitHubClient.create(userId);
        const repository = await client
          .getRepo(org, repo)
          .catch((error: unknown) => {
            if (error instanceof RequestError && error.status === 404) {
              throw new Error("Repository not found.");
            }

            throw error;
          });

        if (!repository.permissions?.push) {
          throw new Error("Can not add repository without push permission.");
        }

        const project = await prisma.project.upsert({
          select: { id: true },
          where: {
            org_repo_providerId: { org, repo, providerId },
          },
          create: {
            org,
            repo,
            providerId,
            users: { connect: { id: userId } },
          },
          update: {
            users: { connect: { id: userId } },
          },
        });

        return {
          redirect: {
            permanent: false,
            destination: `/app/projects/${project.id}`,
          },
        };
      } catch (error: unknown) {
        return {
          props: {
            error:
              error instanceof Error ? error.message : "Failed to add project",
          },
        };
      }
    }

    return { props: {} };
  }
);

export default function AddProjectPage({
  error,
}: AddProjectPageProps): ReactElement {
  // const router = useRouter();

  // return (
  //   <AppLayout breadcrumbs={[["Projects", "/app/projects"], "Add"]}>

  //   </AppLayout>
  // );

  return (
    <Dialog open={true} fullWidth={true} maxWidth="xs">
      {error ? (
        <Alert
          severity="error"
          action={
            <NextLink replace={true} passHref={true} href="/app/projects/add">
              <Button color="inherit">Retry</Button>
            </NextLink>
          }
        >
          {error}
        </Alert>
      ) : (
        <form method="get">
          <DialogContent>
            <TextField
              name="repo"
              label="Repo URL"
              required={true}
              fullWidth={true}
              autoFocus={true}
              placeholder="https://github.com/umidbekk/next-cypress-dashboard"
            />
          </DialogContent>

          <DialogActions>
            <NextLink replace={true} passHref={true} href="/app/projects">
              <Button>Dismiss</Button>
            </NextLink>

            <Button>Confirm</Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
}
