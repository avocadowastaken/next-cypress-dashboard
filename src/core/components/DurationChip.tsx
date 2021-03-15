import { Chip, Skeleton } from "@material-ui/core";
import { Timer } from "@material-ui/icons";
import { format as formatDate, setMilliseconds, startOfToday } from "date-fns";
import React, { ReactElement, useMemo } from "react";

export interface DurationChipProps {
  start: null | undefined | Date;
  finish: null | undefined | Date;
}

export function DurationChip({
  start,
  finish,
}: DurationChipProps): ReactElement {
  const startTime = start?.getTime();
  const finishTime = finish?.getTime();
  const duration = useMemo(() => {
    if (startTime && finishTime) {
      const diff = Math.abs(startTime - finishTime);

      if (diff) {
        return formatDate(setMilliseconds(startOfToday(), diff), "mm:ss");
      }
    }

    return null;
  }, [startTime, finishTime]);

  return (
    <Chip icon={<Timer />} label={duration || <Skeleton width="33px" />} />
  );
}
