import { prisma } from "@/api/db";
import { AppLayout } from "@/app/AppLayout";
import { toPageParam } from "@/app/data/PaginationParams";
import { createServerSideProps } from "@/app/data/ServerSideProps";
import {
  ElectronFramework,
  Firefox,
  GoogleChrome,
  Linux,
  MicrosoftEdge,
  MicrosoftWindows,
  SourceBranch,
} from "@/app/icons";
import { CreateRunInput } from "@/shared/cypress-types";
import {
  Avatar,
  Button,
  Chip,
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
} from "@material-ui/core";
import { AccessTime, Apple } from "@material-ui/icons";
import { Project, Run } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
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
              const platform = run.platform as CreateRunInput["platform"];

              const OSIcon = platform.osName === "darwin" ? Apple : Linux;

              return (
                <TableRow key={run.id}>
                  <TableCell variant="head">
                    <Grid container={true} spacing={1}>
                      <Grid item={true} xs={12}>
                        <NextLink
                          passHref={true}
                          href={`/app/projects/${run.projectId}/runs/${run.id}`}
                        >
                          <Link variant="subtitle1">{commit.message}</Link>
                        </NextLink>
                      </Grid>

                      <Grid item={true}>
                        <Chip
                          component="a"
                          clickable={true}
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://github.com/search?type=users&q=${encodeURIComponent(
                            commit.authorName
                          )}`}
                          label={commit.authorName}
                          avatar={
                            <Avatar
                              alt={commit.authorName}
                              src={`/avatar?email=${encodeURIComponent(
                                commit.authorEmail
                              )}`}
                            />
                          }
                        />
                      </Grid>

                      <Grid item={true}>
                        <Tooltip title={run.createdAt.toLocaleString()}>
                          <Chip
                            icon={<AccessTime />}
                            label={
                              <>
                                Started{" "}
                                {formatDistanceToNow(run.createdAt, {
                                  addSuffix: true,
                                })}
                              </>
                            }
                          />
                        </Tooltip>
                      </Grid>

                      <Grid item={true}>
                        <Chip
                          component="a"
                          target="_blank"
                          clickable={true}
                          label={commit.branch}
                          icon={<SourceBranch />}
                          rel="noopener noreferrer"
                          href={`https://github.com/${project.org}/${project.repo}/commit/${commit.sha}`}
                        />
                      </Grid>

                      <Grid item={true}>
                        <Tooltip
                          title={`${platform.osName} ${platform.osVersion}`}
                        >
                          <Chip
                            label={platform.osVersion}
                            icon={
                              platform.osName === "darwin" ? (
                                <Apple viewBox="0 0 24 26" />
                              ) : platform.osName === "windows" ? (
                                <MicrosoftWindows />
                              ) : (
                                <Linux />
                              )
                            }
                          />
                        </Tooltip>
                      </Grid>

                      <Grid item={true}>
                        <Tooltip
                          title={`${platform.browserName} ${platform.browserVersion}`}
                        >
                          <Chip
                            label={platform.browserVersion}
                            icon={
                              platform.browserName === "Chrome" ||
                              platform.browserName === "Chromium" ? (
                                <GoogleChrome />
                              ) : platform.browserName === "Edge" ? (
                                <MicrosoftEdge />
                              ) : platform.browserName === "Firefox" ? (
                                <Firefox />
                              ) : (
                                <ElectronFramework />
                              )
                            }
                          />
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
