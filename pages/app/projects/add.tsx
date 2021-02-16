import { prisma } from "@/api/db";
import { GitHubClient } from "@/api/GitHubClient";
import { createServerSideProps } from "@/data/ServerSideProps";
import { AppLayout } from "@/ui/AppLayout";
import { Alert, Button, IconButton } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { RequestError } from "@octokit/request-error";
import dynamic from "next/dynamic";
import NextLink from "next/link";
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
    const { owner, repo } = query;

    if (owner && repo) {
      try {
        if (typeof owner != "string" || typeof repo != "string") {
          throw new Error("Invalid Input");
        }

        const client = await GitHubClient.create(userId);
        const repository = await client
          .getRepo(owner, repo)
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
            org_repo_providerId: { repo, org: owner, providerId: "github" },
          },
          create: {
            repo,
            org: owner,
            providerId: "github",
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

    // if (typeof owner == "string" && typeof repo == "string") {
    //   // app.post<{ Body: { owner: string; repo: string } }>(
    //   //   "/api/user/projects",
    //   //   async ({ raw, body: { repo, owner } }, reply) => {
    //   //     const { userId } = await SecurityContext.create(raw);

    //   //
    //   //     reply.send(project);
    //   //   }
    //   // );
    // }

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
      backButton={
        <NextLink replace={true} passHref={true} href="/app/projects">
          <IconButton>
            <ArrowBack />
          </IconButton>
        </NextLink>
      }
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
              Reset
            </Button>
          }
        >
          {error}
        </Alert>
      ) : (
        <AddProjectForm
          onSubmit={(data) => {
            void router.push({
              search: new URLSearchParams(data).toString(),
            });
          }}
        />
      )}
    </AppLayout>
  );
}
