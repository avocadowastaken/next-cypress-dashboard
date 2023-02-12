import { formatDateTime, formatDuration } from "@/lib/Date";
import { ONE_SECOND, scheduleCron } from "@/lib/MicroCron";
import { Timer } from "@mui/icons-material";
import { Chip, Skeleton, Tooltip } from "@mui/material";
import { ReactElement, useEffect, useMemo, useState } from "react";

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

  const [duration, tooltip] = useMemo(() => {
    if (startTime && finishTime) {
      return [
        formatDuration(startTime, finishTime),
        `${formatDateTime(startTime)} – ${formatDateTime(finishTime)}`,
      ];
    }

    return [];
  }, [startTime, finishTime]);

  useEffect(() => {
    if (!startTime || finish || !enableCounter) {
      setFinishTime(finish?.getTime());
      return;
    }

    setFinishTime(Date.now());
    return scheduleCron(ONE_SECOND, () => {
      setFinishTime(Date.now());
    });
  }, [startTime, finish, enableCounter]);

  return (
    <Tooltip title={tooltip || "Pending…"}>
      <Chip icon={<Timer />} label={duration || <Skeleton width="33px" />} />
    </Tooltip>
  );
}
