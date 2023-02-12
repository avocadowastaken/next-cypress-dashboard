import { DurationChip } from "@/ui/core/DurationChip";
import { DebugStepOver, SyncCircle } from "@/ui/core/icons";
import { Check, Error } from "@mui/icons-material";
import { Chip, Link, Stack, Tooltip } from "@mui/material";
import { Run, RunInstance } from "@prisma/client";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { ReactElement } from "react";

export interface RunInstanceAttributesProps {
  run: Run;
  runInstance: RunInstance;
}

export function RunInstanceAttributes({
  run: { projectId },
  runInstance: {
    id,
    spec,
    runId,
    claimedAt,
    completedAt,
    totalPassed,
    totalFailed,
    totalPending,
    totalSkipped,
  },
}: RunInstanceAttributesProps): ReactElement {
  const router = useRouter();

  return (
    <Stack spacing={1} direction="row">
      <DurationChip
        start={claimedAt}
        finish={completedAt}
        enableCounter={true}
      />

      {totalPassed > 0 && (
        <Tooltip title="Passed">
          <Chip icon={<Check />} label={totalPassed} />
        </Tooltip>
      )}

      {totalFailed > 0 && (
        <Tooltip title="Failed">
          <Chip icon={<Error />} label={totalFailed} />
        </Tooltip>
      )}

      {totalPending > 0 && (
        <Tooltip title="Pending">
          <Chip icon={<SyncCircle />} label={totalPending} />
        </Tooltip>
      )}

      {totalSkipped > 0 && (
        <Tooltip title="Skipped">
          <Chip icon={<DebugStepOver />} label={totalSkipped} />
        </Tooltip>
      )}

      <NextLink
        passHref={true}
        href={{
          query: { exclude: router.query["exclude"] || [] },
          pathname: `/projects/${projectId}/runs/${runId}/instances/${id}`,
        }}
      >
        <Link>{spec}</Link>
      </NextLink>
    </Stack>
  );
}
