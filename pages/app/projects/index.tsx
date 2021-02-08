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
import React, { ReactElement } from "react";

export default function Projects(): ReactElement {
  return (
    <AppLayout
      title="Projects"
      actions={
        <Button size="small" endIcon={<Add />}>
          Add
        </Button>
      }
    >
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
