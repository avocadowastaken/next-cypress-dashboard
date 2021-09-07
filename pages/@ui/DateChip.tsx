import { formatDateTime, formatTimeDistance } from "@/lib/Date";
import {
  ONE_HOUR,
  ONE_MINUTE,
  ONE_SECOND,
  scheduleCron,
} from "@/lib/MicroCron";
import { AccessTime } from "@mui/icons-material";
import { Chip, Tooltip } from "@mui/material";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface DateChipProps {
  value: Date;
}

export function DateChip({ value }: DateChipProps): ReactElement {
  const time = value.getTime();
  const formattedDate = useMemo(() => formatDateTime(time), [time]);

  const createDistance = useCallback(() => formatTimeDistance(time), [time]);
  const [distance, setDistance] = useState(createDistance);
  const timePassed = Math.abs(Date.now() - time);
  const refreshInterval =
    timePassed < ONE_MINUTE
      ? ONE_SECOND
      : timePassed < ONE_HOUR
      ? ONE_MINUTE
      : ONE_HOUR;

  useEffect(() => {
    setDistance(createDistance);
    return scheduleCron(refreshInterval, () => {
      setDistance(createDistance);
    });
  }, [createDistance, refreshInterval]);

  return (
    <Tooltip title={formattedDate}>
      <Chip icon={<AccessTime />} label={distance} />
    </Tooltip>
  );
}
