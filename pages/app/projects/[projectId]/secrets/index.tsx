import { prisma } from "@/api/db";
import { GitHubClient } from "@/api/GitHubClient";
import { AppTitle } from "@/app/AppLayout";
import { SignInButton } from "@/app/auth/SignInButton";
import { createServerSideProps } from "@/app/data/ServerSideProps";
import {
  AppErrorCode,
  extractErrorCode,
  formatErrorCode,
  isGitHubIntegrationError,
} from "@/shared/AppError";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { Refresh } from "@material-ui/icons";
import { Project, ProjectSecrets } from "@prisma/client";
import NextLink from "next/link";
import React, { ReactElement } from "react";

export interface ProjectSecretsPageProps {
  error?: AppErrorCode;
  project: Project;
  secrets?: null | ProjectSecrets;
}

export const getServerSideProps = createServerSideProps<
  ProjectSecretsPageProps,
  { projectId: string }
>(async ({ userId }, { params }) => {
  const projectId = params?.projectId;

  if (projectId) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, users: { some: { id: userId } } },
    });

    if (project) {
      try {
        const client = await GitHubClient.create(userId);

        await client.verifyRepoAccess(project.org, project.repo);

        const secrets = await prisma.projectSecrets.findUnique({
          where: { projectId: project.id },
        });

        return { props: { project, secrets } };
      } catch (error: unknown) {
        return { props: { project, error: extractErrorCode(error) } };
      }
    }
  }

  return { notFound: true };
});

export default function ProjectSecretsPage({
  error,
  project,
  secrets,
}: ProjectSecretsPageProps): ReactElement {
  return (
    <Dialog open={true} maxWidth="xs" fullWidth={true}>
      <AppTitle
        breadcrumbs={["Projects", `${project.org}/${project.repo}`, "Secrets"]}
      />

      {error ? (
        isGitHubIntegrationError(error) ? (
          <Alert severity="error" action={<SignInButton />}>
            Failed to establish connection with GitHub
          </Alert>
        ) : (
          <Alert
            severity="error"
            action={
              error === "GITHUB_REPO_NOT_FOUND" ||
              error === "GITHUB_REPO_ACCESS_DENIED" ? (
                <NextLink
                  passHref={true}
                  href={`/app/projects/${project.id}/delete`}
                >
                  <Button color="inherit">Delete</Button>
                </NextLink>
              ) : (
                <NextLink passHref={true} href={`/app/projects/${project.id}`}>
                  <Button color="inherit">Close</Button>
                </NextLink>
              )
            }
          >
            {formatErrorCode(error)}
          </Alert>
        )
      ) : !secrets ? (
        <Alert
          severity="error"
          action={
            <NextLink href={`/app/projects/${project.id}/secrets/restore`}>
              <Button color="inherit">Restore</Button>
            </NextLink>
          }
        >
          Projects secrets not found
        </Alert>
      ) : (
        <>
          <DialogContent>
            <TextField
              multiline={true}
              fullWidth={true}
              label="Record Key"
              value={secrets.recordKey}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <NextLink
                      passHref={true}
                      href={`/app/projects/${project.id}/secrets/${secrets.id}/revoke`}
                    >
                      <Tooltip title="Revoke">
                        <IconButton>
                          <Refresh />
                        </IconButton>
                      </Tooltip>
                    </NextLink>
                  </InputAdornment>
                ),
              }}
            />
          </DialogContent>

          <DialogActions>
            <NextLink passHref={true} href={`/app/projects/${project.id}`}>
              <Button>Close</Button>
            </NextLink>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
