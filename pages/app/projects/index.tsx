import { AddProjectDialog } from "@/app/projects/AddProjectDialog";
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
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

export default function Projects(): ReactElement {
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
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Provider</TableCell>
              <TableCell>Organization</TableCell>
              <TableCell>Repo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                github
              </TableCell>
              <TableCell>umidbekkarimov</TableCell>
              <TableCell>
                <NextLink passHref={true} prefetch={true} href="/app/projects">
                  <Link>next-cypress-dashboard</Link>
                </NextLink>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </AppLayout>
  );
}
