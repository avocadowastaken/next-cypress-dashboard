import {
  createServerSideProps,
  redirectToSignIn,
} from "@/app/data/ServerSideProps";
import { prisma } from "@/server/db";
import { verifyGitHubRepoAccess } from "@/server/GitHubClient";
import { AppLayout } from "@/ui/AppLayout";
import { RunAttributes } from "@/ui/RunAttributes";
import { RunInstanceAttributes } from "@/ui/RunInstanceAttributes";
import {
  Button,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@material-ui/core";
import { Project, Run, RunInstance } from "@prisma/client";
import NextLink from "next/link";
import React, { ReactElement } from "react";

interface RunPageProps {
  run: Run & { project: Project; instances: RunInstance[] };
}

export const getServerSideProps = createServerSideProps<
  RunPageProps,
  { runId: string }
>(async ({ userId }, context) => {
  const runId = context.params?.runId;

  if (runId) {
    const run = await prisma.run.findFirst({
      where: {
        id: runId,
        project: { users: { some: { id: userId } } },
      },
      include: {
        project: true,
        instances: { orderBy: [{ totalFailed: "desc" }, { claimedAt: "asc" }] },
      },
    });

    if (run) {
      try {
        await verifyGitHubRepoAccess(userId, run.project.org, run.project.repo);
      } catch {
        return redirectToSignIn(context);
      }

      return { props: { run } };
    }
  }

  return { notFound: true };
});

export default function RunPage({ run }: RunPageProps): ReactElement {
  return (
    <AppLayout
      breadcrumbs={[
        ["Projects", "/p"],
        [`${run.project.org} / ${run.project.repo}`, `/p/${run.project.id}`],
      ]}
      actions={
        <NextLink href={`/r/${run.id}/delete`}>
          <Button>Delete</Button>
        </NextLink>
      }
    >
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={12}>
          <RunAttributes run={run} project={run.project} />
        </Grid>

        <Grid item={true} xs={12}>
          <Divider />
        </Grid>

        <Grid item={true} xs={12}>
          <TableContainer>
            <Table>
              <TableBody>
                {run.instances.map((runInstance) => (
                  <TableRow key={runInstance.id}>
                    <TableCell align="center">
                      <RunInstanceAttributes runInstance={runInstance} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </AppLayout>
  );
}
