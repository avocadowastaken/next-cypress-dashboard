import { prisma } from "@/api/db";
import { GitHubClient } from "@/api/GitHubClient";
import { AppLayout } from "@/app/AppLayout";
import {
  createServerSideProps,
  redirectToSignIn,
} from "@/app/data/ServerSideProps";
import { Pre } from "@/app/ui/Pre";
import {
  AppErrorCode,
  extractErrorCode,
  formatErrorCode,
  isGitHubIntegrationError,
} from "@/shared/AppError";
import {
  Alert,
  Button,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@material-ui/core";
import { Project, ProjectSecrets } from "@prisma/client";
import NextLink from "next/link";
import React, { ReactElement } from "react";

export interface ProjectSecretsPageProps {
  project: Project;
  errorCode?: AppErrorCode;
  secrets?: null | ProjectSecrets;
}

export const getServerSideProps = createServerSideProps<
  ProjectSecretsPageProps,
  { projectId: string }
>(async ({ userId }, context) => {
  const projectId = context.params?.projectId;

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
        const errorCode = extractErrorCode(error);

        if (isGitHubIntegrationError(errorCode)) {
          return redirectToSignIn(context);
        }

        return { props: { project, errorCode } };
      }
    }
  }

  return { notFound: true };
});

export default function ProjectSecretsPage({
  errorCode,
  project,
  secrets,
}: ProjectSecretsPageProps): ReactElement {
  return (
    <AppLayout
      breadcrumbs={[
        ["Projects", "/app/projects"],
        [`${project.org} / ${project.repo}`, `/app/projects/${project.id}`],
        "Settings",
      ]}
      actions={
        !errorCode && (
          <NextLink passHref={true} href={`/app/projects/${project.id}/delete`}>
            <Button>Delete</Button>
          </NextLink>
        )
      }
    >
      {errorCode ? (
        <Alert
          severity="error"
          action={
            errorCode === "GITHUB_REPO_NOT_FOUND" ||
            errorCode === "GITHUB_REPO_ACCESS_DENIED" ? (
              <NextLink
                passHref={true}
                href={{
                  pathname: `/app/projects/${project.id}/delete`,
                  query: { confirmation: `${project.org}/${project.repo}` },
                }}
              >
                <Button color="inherit">Delete Project</Button>
              </NextLink>
            ) : (
              <NextLink passHref={true} href={`/app/projects/${project.id}`}>
                <Button color="inherit">Close</Button>
              </NextLink>
            )
          }
        >
          {formatErrorCode(errorCode)}
        </Alert>
      ) : (
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell variant="head">
                  Project ID
                  <Typography variant="body2" display="block">
                    This <code>projectId</code> should be in your{" "}
                    <code>cypress.json</code>
                  </Typography>
                </TableCell>

                <TableCell>
                  <Pre>
                    {JSON.stringify({ projectId: project.id }, null, 2)}
                  </Pre>
                </TableCell>
              </TableRow>

              {!secrets ? (
                <TableRow>
                  <TableCell variant="head">Record Key</TableCell>

                  <TableCell>
                    <Alert
                      severity="error"
                      action={
                        <NextLink
                          href={`/app/projects/${project.id}/secrets/restore`}
                        >
                          <Button color="inherit">Regenerate</Button>
                        </NextLink>
                      }
                    >
                      Projects secrets not found
                    </Alert>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell variant="head">
                    Record Key
                    <Typography variant="body2" display="block">
                      Secret key, do not expose it, but if you did you can{" "}
                      <NextLink
                        passHref={true}
                        href={`/app/projects/${project.id}/secrets/${secrets.id}/revoke`}
                      >
                        <Link>revoke</Link>
                      </NextLink>{" "}
                      it anytime
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Pre>cypress run --record --key {secrets.recordKey}</Pre>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </AppLayout>
  );
}
