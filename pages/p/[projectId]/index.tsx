import { toPageParam } from "@/app/data/PaginationParams";
import { createServerSideProps } from "@/app/data/ServerSideProps";
import { prisma } from "@/server/db";
import { AppLayout } from "@/ui/AppLayout";
import { RunAttributes } from "@/ui/RunAttributes";
import {
  Button,
  Pagination,
  PaginationItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableRow,
} from "@material-ui/core";
import { Project, Run } from "@prisma/client";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

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
    const take = 5;
    const page = toPageParam(query.page);

    const [count, project] = await Promise.all([
      prisma.run.count({ where: { projectId } }),
      prisma.project.findFirst({
        where: { id: projectId, users: { some: { id: userId } } },
        include: {
          runs: {
            take,
            skip: (page - 1) * take,
            orderBy: { createdAt: "desc" },
          },
        },
      }),
    ]);

    if (project) {
      if (count === 0) {
        return {
          redirect: {
            permanent: false,
            destination: `/p/${projectId}/settings`,
          },
        };
      }

      const maxPage = Math.ceil(count / take);

      return { props: { project, page, maxPage } };
    }
  }

  return { notFound: true };
});

export default function ProjectPage({
  page,
  maxPage,
  project,
}: ProjectPageProps): ReactElement {
  const router = useRouter();

  return (
    <AppLayout
      breadcrumbs={[["Projects", "/p"], `${project.org} / ${project.repo}`]}
      actions={
        <>
          <NextLink passHref={true} href={`/p/${project.id}/settings`}>
            <Button>Settings</Button>
          </NextLink>
        </>
      }
    >
      <TableContainer>
        <Table>
          <TableBody>
            {project.runs.map((run) => (
              <TableRow key={run.id}>
                <TableCell>
                  <RunAttributes run={run} project={project} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          {maxPage > 1 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>
                  <Pagination
                    page={page}
                    count={maxPage}
                    renderItem={(item) => (
                      <NextLink
                        passHref={true}
                        href={{
                          pathname: `/p/${project.id}`,
                          query: { ...router.query, page: item.page },
                        }}
                      >
                        <PaginationItem {...item} />
                      </NextLink>
                    )}
                  />
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>
    </AppLayout>
  );
}
