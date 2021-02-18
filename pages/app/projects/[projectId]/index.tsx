import { prisma } from "@/api/db";
import { AppLayout } from "@/app/AppLayout";
import { toPageParam } from "@/app/data/PaginationParams";
import { createServerSideProps } from "@/app/data/ServerSideProps";
import { Button } from "@material-ui/core";
import { Project, Run } from "@prisma/client";
import NextLink from "next/link";
import { ReactElement } from "react";

const ROWS_PER_PAGE = [5, 10];

interface ProjectPageProps {
  page: number;
  maxPage: number;
  project: Project & { runs: Run[] };
}

export const getServerSideProps = createServerSideProps<
  ProjectPageProps,
  { projectId: string }
>(async ({ userId }, { query, params }) => {
  const projectId = params?.projectId;

  if (projectId) {
    const take = 10;
    const page = toPageParam(query.page);

    const [count, project] = await Promise.all([
      prisma.run.count({ where: { projectId } }),
      prisma.project.findFirst({
        where: { id: projectId, users: { some: { id: userId } } },
        include: { runs: { take, skip: (page - 1) * take } },
      }),
    ]);

    if (project) {
      const maxPage = Math.ceil(count / take);

      return { props: { project, page, maxPage } };
    }
  }

  return { notFound: true };
});

export default function ProjectPage({
  project,
}: ProjectPageProps): ReactElement {
  return (
    <AppLayout
      breadcrumbs={[
        ["Projects", "/app/projects"],
        `${project.org}/${project.repo}`,
      ]}
      actions={
        <>
          <NextLink
            passHref={true}
            href={`/app/projects/${project.id}/secrets`}
          >
            <Button>Secrets</Button>
          </NextLink>

          <NextLink passHref={true} href={`/app/projects/${project.id}/delete`}>
            <Button>Delete</Button>
          </NextLink>
        </>
      }
    >
      <pre>{JSON.stringify(project, null, 2)}</pre>
    </AppLayout>
  );
}
