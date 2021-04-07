import { Chip, Skeleton } from "@material-ui/core";
import { Timer } from "@material-ui/icons";
import { format as formatDate, setMilliseconds, startOfToday } from "date-fns";
import React, { ReactElement, useEffect, useMemo, useState } from "react";

export interface DurationChipProps {
  enableCounter?: boolean;
  start: null | undefined | Date;
  finish: null | undefined | Date;
}

export function DurationChip({
  start,
  finish,
  enableCounter = false,
}: DurationChipProps): ReactElement {
  const startTime = start?.getTime();
  const [finishTime, setFinishTime] = useState(finish?.getTime());

  const duration = useMemo(() => {
    if (startTime && finishTime) {
      const diff = Math.abs(startTime - finishTime);

      if (diff) {
        return formatDate(setMilliseconds(startOfToday(), diff), "mm:ss");
      }
    }

    return null;
  }, [startTime, finishTime]);

  useEffect(() => {
    if (!startTime || finish || !enableCounter) {
      setFinishTime(finish?.getTime());
      return;
    }

    setFinishTime(Date.now());
    const interval = setInterval(() => {
      setFinishTime(Date.now());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [startTime, finish, enableCounter]);

  return (
    <Chip icon={<Timer />} label={duration || <Skeleton width="33px" />} />
  );
}
