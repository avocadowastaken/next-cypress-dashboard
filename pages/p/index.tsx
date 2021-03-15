import { AppLayout } from "@/core/components/AppLayout";
import { PageResponse } from "@/core/data/PageResponse";
import { formatProjectName } from "@/projects/helpers";
import {
  Button,
  Link,
  Pagination,
  PaginationItem,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { Project } from "@prisma/client";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import { useQuery } from "react-query";

export default function ProjectsPage(): ReactElement {
  const router = useRouter();
  const response = useQuery<PageResponse<Project>>(
    `/api/projects?page=${router.query.page}`,
    { keepPreviousData: true }
  );

  return (
    <AppLayout
      breadcrumbs={["Projects"]}
      actions={
        <NextLink passHref={true} href="/p/add">
          <Button size="small" endIcon={<Add />}>
            Add
          </Button>
        </NextLink>
      }
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Provider</TableCell>
              <TableCell>Repo</TableCell>
            </TableRow>
          </TableHead>

          {response.status !== "success" ? (
            <TableBody>
              <TableRow>
                <TableCell>
                  <Skeleton />
                </TableCell>

                <TableCell>
                  <Skeleton />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <>
              <TableBody>
                {response.data.nodes.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.providerId}</TableCell>

                    <TableCell>
                      <NextLink passHref={true} href={`/p/${project.id}`}>
                        <Link>{formatProjectName(project)}</Link>
                      </NextLink>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              {response.data.maxPage > 1 && (
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Pagination
                        page={response.data.page}
                        count={response.data.maxPage}
                        renderItem={(item) => (
                          <NextLink
                            passHref={true}
                            href={{
                              pathname: "/p",
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
