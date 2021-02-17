import { prisma } from "@/api/db";
import { AppLayout } from "@/app/AppLayout";
import { toPageParam } from "@/app/data/PaginationParams";
import { createServerSideProps } from "@/app/data/ServerSideProps";
import {
  Button,
  Link,
  Pagination,
  PaginationItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { Prisma, Project } from "@prisma/client";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

interface ProjectsPageProps {
  page: number;
  maxPage: number;
  projects: Project[];
}

export const getServerSideProps = createServerSideProps<ProjectsPageProps>(
  async ({ userId }, { query }) => {
    const take = 10;
    const page = toPageParam(query.page);
    const where: Prisma.ProjectWhereInput = {
      users: { some: { id: userId } },
    };

    const [count, projects] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({ where, take, skip: (page - 1) * take }),
    ]);

    const maxPage = Math.ceil(count / take);

    return { props: { page, maxPage, projects } };
  }
);

export default function ProjectsPage({
  page,
  maxPage,
  projects,
}: ProjectsPageProps): ReactElement {
  const router = useRouter();

  return (
    <AppLayout
      breadcrumbs={["Projects"]}
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
                          pathname: "/app/projects",
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
