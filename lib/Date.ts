import {
  format as formatDate,
  formatDistanceToNowStrict,
  intlFormat,
  setMilliseconds,
  startOfToday,
} from "date-fns";

export type DateInput = number | Date;

export function formatDateTime(input: DateInput): string {
  return intlFormat(input, {
    year: "numeric",
    day: "numeric",
    month: "short",
    second: "2-digit",
    minute: "2-digit",
    hour: "2-digit",
  });
}

export function formatTimeDistance(input: DateInput): string {
  return formatDistanceToNowStrict(input, { addSuffix: true });
}

export function formatDuration(start: DateInput, finish: DateInput): string {
  const timeDiff = Math.abs(start.valueOf() - finish.valueOf());
  return formatDate(setMilliseconds(startOfToday(), timeDiff), "mm:ss");
}
