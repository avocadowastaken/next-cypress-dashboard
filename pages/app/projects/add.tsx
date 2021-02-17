import { prisma } from "@/api/db";
import { GitHubClient } from "@/api/GitHubClient";
import { SignInButton } from "@/app/auth/SignInButton";
import { createServerSideProps } from "@/app/data/ServerSideProps";
import {
  AppErrorCode,
  extractErrorCode,
  formatErrorCode,
  isGitHubIntegrationError,
} from "@/shared/AppError";
import { parseGitUrl } from "@/shared/GitUrl";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from "@material-ui/core";
import NextLink from "next/link";
import React, { ReactElement } from "react";

interface AddProjectPageProps {
  error?: AppErrorCode;
}

export const getServerSideProps = createServerSideProps<AddProjectPageProps>(
  async ({ userId }, { query }) => {
    const { repo: repoUrl } = query;

    if (repoUrl) {
      if (typeof repoUrl != "string") {
        return { props: { error: "BAD_REQUEST" } };
      }

      try {
        const [providerId, org, repo] = parseGitUrl(repoUrl);
        const client = await GitHubClient.create(userId);

        await client.verifyRepoAccess(org, repo);

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
        return { props: { error: extractErrorCode(error) } };
      }
    }

    return { props: {} };
  }
);

export default function AddProjectPage({
  error,
}: AddProjectPageProps): ReactElement {
  return (
    <Dialog open={true} fullWidth={true} maxWidth="xs">
      {error ? (
        isGitHubIntegrationError(error) ? (
          <Alert severity="error" action={<SignInButton />}>
            Failed to establish connection with GitHub
          </Alert>
        ) : (
          <Alert
            severity="error"
            action={
              <NextLink replace={true} passHref={true} href="/app/projects/add">
                <Button color="inherit">Retry</Button>
              </NextLink>
            }
          >
            {formatErrorCode(error)}
          </Alert>
        )
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
