import { format, getYear } from "date-fns";

export function getYearFromUnix(unixTime: number): number {
  const date = new Date(unixTime * 1000);
  return getYear(date);
}

export function getDateFromUnix(unixTime: number) {
  const date = new Date(unixTime * 1000);
  return format(date, "MMMM d, yyyy");
}
