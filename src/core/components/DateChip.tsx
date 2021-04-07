import { Chip, Tooltip } from "@material-ui/core";
import { AccessTime } from "@material-ui/icons";
import { formatDistanceToNowStrict, intlFormat } from "date-fns";
import React, { ReactElement, useEffect, useMemo, useState } from "react";

const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

function toDistance(input: number): string {
  return formatDistanceToNowStrict(input, { addSuffix: true });
}

function getRerenderDelay(input: number): number {
  const diff = Math.abs(Date.now() - input);

  return diff < ONE_MINUTE
    ? ONE_SECOND
    : diff < ONE_HOUR
    ? ONE_MINUTE
    : ONE_HOUR;
}

export interface DateChipProps {
  value: Date;
}

export function DateChip({ value }: DateChipProps): ReactElement {
  const timestamp = value.getTime();
  const formattedDate = useMemo(
    () =>
      intlFormat(timestamp, {
        year: "numeric",
        day: "numeric",
        month: "short",

        second: "2-digit",
        minute: "2-digit",
        hour: "2-digit",
      }),
    [timestamp]
  );
  const [distance, setDistance] = useState(() => toDistance(timestamp));

  useEffect(() => {
    const delay = getRerenderDelay(timestamp);
    const timeout = setTimeout(() => setDistance(toDistance(timestamp)), delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [distance, timestamp]);

  return (
    <Tooltip title={formattedDate}>
      <Chip icon={<AccessTime />} label={distance} />
    </Tooltip>
  );
}
