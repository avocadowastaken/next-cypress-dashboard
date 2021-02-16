import { prisma } from "@/api/db";
import { GitHubClient } from "@/api/GitHubClient";
import { createServerSideProps } from "@/data/ServerSideProps";
import { parseGitUrl } from "@/shared/GitUrl";
import { AppLayout } from "@/ui/AppLayout";
import { BackButton } from "@/ui/BackButton";
import { Alert, Button } from "@material-ui/core";
import { RequestError } from "@octokit/request-error";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

const AddProjectForm = dynamic(() => import("@/app/projects/AddProjectForm"), {
  ssr: false,
});

interface AddProjectPageProps {
  error?: string;
}

export const getServerSideProps = createServerSideProps<AddProjectPageProps>(
  async ({ userId }, { query }) => {
    const { repo } = query;

    if (repo) {
      try {
        if (typeof repo != "string") {
          throw new Error("Invalid Input");
        }

        const [providerId, org, name] = parseGitUrl(repo);

        if (!org || !name) {
          throw new Error("Invalid repository URL");
        }

        const client = await GitHubClient.create(userId);
        const repository = await client
          .getRepo(org, name)
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
  const router = useRouter();

  return (
    <AppLayout
      maxWidth="xs"
      title="Add Project"
      backButton={<BackButton href="/app/projects" />}
    >
      {error ? (
        <Alert
          variant="filled"
          severity="error"
          action={
            <Button
              color="inherit"
              onClick={() => {
                void router.push({ search: "" });
              }}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      ) : (
        <AddProjectForm />
      )}
    </AppLayout>
  );
}
