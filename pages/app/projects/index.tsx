import { prisma } from "@/api/db";
import { AddProjectDialog } from "@/app/projects/AddProjectDialog";
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
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { Project } from "@prisma/client";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

interface ProjectsPageProps {
  projects: Project[];
}

export const getServerSideProps = createServerSideProps<ProjectsPageProps>(
  async ({ userId }) => {
    const projects = await prisma.project.findMany({
      skip: 0,
      take: 10,
      where: { users: { some: { id: userId } } },
    });

    return {
      props: { projects },
    };
  }
);

export default function ProjectsPage({
  projects,
}: ProjectsPageProps): ReactElement {
  const router = useRouter();

  return (
    <AppLayout
      title="Projects"
      actions={
        <NextLink
          passHref={true}
          href={{ query: { ...router.query, project: "add" } }}
        >
          <Button size="small" endIcon={<Add />}>
            Add
          </Button>
        </NextLink>
      }
    >
      <AddProjectDialog
        open={router.query.project === "add"}
        onClose={() => {
          void router.replace({
            query: { ...router.query, project: [] },
          });
        }}
        onSubmitSuccess={(owner, repo) => {
          void router.replace({
            query: { ...router.query, project: `${owner}/${repo}` },
          });
        }}
      />

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
        </Table>
      </TableContainer>
    </AppLayout>
  );
}
