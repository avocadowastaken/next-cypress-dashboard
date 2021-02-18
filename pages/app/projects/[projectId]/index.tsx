import { prisma } from "@/api/db";
import { AppLayout } from "@/app/AppLayout";
import { toPageParam } from "@/app/data/PaginationParams";
import { createServerSideProps } from "@/app/data/ServerSideProps";
import { SourceBranch } from "@/app/icons";
import { CreateRunInput } from "@/shared/cypress-types";
import {
  Avatar,
  Button,
  Grid,
  Link,
  Pagination,
  PaginationItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableRow,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Project, Run } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement, useMemo } from "react";

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
      const maxPage = Math.ceil(count / take);

      if (page > maxPage) {
        return {
          redirect: {
            permanent: false,
            destination: `/app/projects/${projectId}?page=${maxPage}`,
          },
        };
      }

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
  const rtf = useMemo(() => new Intl.RelativeTimeFormat(), []);

  return (
    <AppLayout
      breadcrumbs={[
        ["Projects", "/app/projects"],
        `${project.org} / ${project.repo}`,
      ]}
      actions={
        <>
          <NextLink
            passHref={true}
            href={`/app/projects/${project.id}/settings`}
          >
            <Button>Settings</Button>
          </NextLink>
        </>
      }
    >
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {project.runs.map((run) => {
              const commit = run.commit as CreateRunInput["commit"];

              return (
                <TableRow key={run.id}>
                  <TableCell variant="head">
                    <NextLink
                      passHref={true}
                      href={`/app/projects/${run.projectId}/runs/${run.id}`}
                    >
                      <Link variant="subtitle1">{commit.message}</Link>
                    </NextLink>

                    <Grid container={true} spacing={1} alignItems="center">
                      <Grid item={true}>
                        <Avatar
                          sx={{ height: "18px", width: "18px" }}
                          alt={commit.authorName}
                          src={`/avatar?email=${encodeURIComponent(
                            commit.authorEmail
                          )}`}
                        />
                      </Grid>

                      <Grid item={true}>
                        <Typography variant="caption">
                          {commit.authorName}
                        </Typography>
                      </Grid>

                      <Grid item={true}>•</Grid>

                      <Grid item={true}>
                        <Link
                          variant="caption"
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://github.com/${project.org}/${project.repo}/commit/${commit.sha}`}
                        >
                          <SourceBranch
                            color="action"
                            sx={{
                              fontSize: "1rem",
                              marginRight: "4px",
                              verticalAlign: "middle",
                            }}
                          />

                          {commit.branch}
                        </Link>
                      </Grid>

                      <Grid item={true}>•</Grid>

                      <Grid item={true}>
                        <Tooltip title={run.createdAt.toLocaleString()}>
                          <Typography variant="caption">
                            Ran{" "}
                            {formatDistanceToNow(run.createdAt, {
                              addSuffix: true,
                            })}
                          </Typography>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              );
            })}
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
                          pathname: `/app/projects/${project.id}`,
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
