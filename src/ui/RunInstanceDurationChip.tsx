import { Chip, Skeleton } from "@material-ui/core";
import { Timer } from "@material-ui/icons";
import { RunInstance } from "@prisma/client";
import { format as formatDate, setMilliseconds, startOfToday } from "date-fns";
import React, { ReactElement, useMemo } from "react";

export function RunInstanceDurationChip({
  claimedAt,
  completedAt,
}: Pick<RunInstance, "claimedAt" | "completedAt">): ReactElement {
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
    <Chip icon={<Timer />} label={duration || <Skeleton width="33px" />} />
  );
}
