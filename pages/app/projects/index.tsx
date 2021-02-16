import { prisma } from "@/api/db";
import { toPageParam, toRowsPerPageParam } from "@/data/PaginationParams";
import { createServerSideProps } from "@/data/ServerSideProps";
import { AppLayout } from "@/ui/AppLayout";
import {
  Button,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { Prisma, Project } from "@prisma/client";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

const ROWS_PER_PAGE = [5, 10, 25];

interface ProjectsPageProps {
  page: number;
  count: number;
  rowsPerPage: number;

  projects: Project[];
}

export const getServerSideProps = createServerSideProps<ProjectsPageProps>(
  async ({ userId }, { query }) => {
    const page = toPageParam(query.page);
    const rowsPerPage = toRowsPerPageParam(query.per_page, ROWS_PER_PAGE);

    const where: Prisma.ProjectWhereInput = {
      users: { some: { id: userId } },
    };

    const [count, projects] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        take: rowsPerPage,
        skip: page * rowsPerPage,
      }),
    ]);

    return { props: { page, count, projects, rowsPerPage } };
  }
);

export default function ProjectsPage({
  page,
  count,
  rowsPerPage,
  projects,
}: ProjectsPageProps): ReactElement {
  const router = useRouter();

  return (
    <AppLayout
      title="Projects"
      actions={
        <NextLink passHref={true} href="/app/projects/add">
          <Button size="small" endIcon={<Add />}>
            Add
          </Button>
        </NextLink>
      }
    >
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Provider</TableCell>
              <TableCell>Organization</TableCell>
              <TableCell>Repo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell component="th" scope="row">
                  {project.providerId}
                </TableCell>
                <TableCell>{project.org}</TableCell>
                <TableCell>
                  <NextLink
                    passHref={true}
                    href={`/app/projects/${project.id}`}
                  >
                    <Link>{project.repo}</Link>
                  </NextLink>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                page={page}
                count={count}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={ROWS_PER_PAGE}
                onPageChange={(_, nextPage) => {
                  void router.replace({
                    query: { ...router.query, page: nextPage },
                  });
                }}
                onRowsPerPageChange={(event) => {
                  void router.replace({
                    query: {
                      ...router.query,
                      page: 0,
                      per_page: event.target.value,
                    },
                  });
                }}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </AppLayout>
  );
}
