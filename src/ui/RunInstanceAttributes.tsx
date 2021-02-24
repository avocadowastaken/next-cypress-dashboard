import { DebugStepOver, SyncCircle } from "@/ui/icons";
import { Chip, Grid, Link, Skeleton, Tooltip } from "@material-ui/core";
import { Check, Error, Timer } from "@material-ui/icons";
import { RunInstance } from "@prisma/client";
import { format as formatDate, setMilliseconds, startOfToday } from "date-fns";
import NextLink from "next/link";
import React, { ReactElement, useMemo } from "react";

export interface RunInstanceAttributesProps {
  runInstance: RunInstance;
}

export function RunInstanceAttributes({
  runInstance: {
    id,
    spec,
    claimedAt,
    completedAt,
    totalPassed,
    totalFailed,
    totalPending,
    totalSkipped,
  },
}: RunInstanceAttributesProps): ReactElement {
  const duration = useMemo(() => {
    if (claimedAt && completedAt) {
      const diff = completedAt.getTime() - claimedAt.getTime();

      if (diff) {
        return formatDate(setMilliseconds(startOfToday(), diff), "mm:ss");
      }
    }

    return null;
  }, [claimedAt, completedAt]);

  return (
    <Grid container={true} spacing={1}>
      <Grid item={true}>
        <Chip icon={<Timer />} label={duration || <Skeleton width="33px" />} />
      </Grid>

      {totalPassed > 0 && (
        <Grid item={true}>
          <Tooltip title="Passed">
            <Chip icon={<Check />} label={totalPassed} />
          </Tooltip>
        </Grid>
      )}

      {totalFailed > 0 && (
        <Grid item={true}>
          <Tooltip title="Failed">
            <Chip icon={<Error />} label={totalFailed} />
          </Tooltip>
        </Grid>
      )}

      {totalPending > 0 && (
        <Grid item={true}>
          <Tooltip title="Pending">
            <Chip icon={<SyncCircle />} label={totalPending} />
          </Tooltip>
        </Grid>
      )}

      {totalSkipped > 0 && (
        <Grid item={true}>
          <Tooltip title="Skipped">
            <Chip icon={<DebugStepOver />} label={totalSkipped} />
          </Tooltip>
        </Grid>
      )}

      <Grid item={true}>
        <NextLink passHref={true} href={`/i/${id}`}>
          <Link>{spec}</Link>
        </NextLink>
      </Grid>
    </Grid>
  );
}
