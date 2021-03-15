import { AppLayout } from "@/core/components/AppLayout";
import { ErrorPage } from "@/core/components/ErrorPage";
import { RunAttributes } from "@/core/components/RunAttributes";
import { useErrorHandler } from "@/core/data/AppError";
import { PageResponse } from "@/core/data/PageResponse";
import { useRouterParam } from "@/core/routing/useRouterParam";
import { formatProjectName } from "@/projects/helpers";
import { useProject } from "@/projects/queries";
import {
  Button,
  Pagination,
  PaginationItem,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableRow,
  Typography,
} from "@material-ui/core";
import { Run } from "@prisma/client";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import { useQuery } from "react-query";

export default function ProjectPage(): ReactElement {
  const router = useRouter();
  const projectId = useRouterParam("projectId");
  const project = useProject(projectId);
  const runs = useQuery<PageResponse<Run>>(
    `/api/runs?projectId=${projectId}&page=${router.query.page}`,
    { enabled: project.status === "success" }
  );

  useErrorHandler(project.error || runs.error);

  if (project.status === "error") {
    return <ErrorPage error={project.error} />;
  }

  if (project.status !== "success") {
    return <AppLayout breadcrumbs={[["Projects", "/p"], "…"]} />;
  }

  return (
    <AppLayout
      breadcrumbs={[["Projects", "/p"], formatProjectName(project.data)]}
      actions={
        <NextLink passHref={true} href={`/p/${project.data.id}/settings`}>
          <Button>Settings</Button>
        </NextLink>
      }
    >
      <TableContainer>
        <Table>
          {runs.status !== "success" ? (
            <TableBody>
              <TableRow>
                <TableCell>
                  <Skeleton />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : runs.data.count === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography color="textSecondary" align="center">
                    No Runs
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <>
              <TableBody>
                {runs.data.nodes.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell>
                      <RunAttributes run={run} project={project.data} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              {runs.data.maxPage > 1 && (
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Pagination
                        page={runs.data.page}
                        count={runs.data.maxPage}
                        renderItem={(item) => (
                          <NextLink
                            passHref={true}
                            href={{
                              pathname: router.pathname,
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
            </>
          )}
        </Table>
      </TableContainer>
    </AppLayout>
  );
}
