import { format, isSameYear } from "date-fns";

export const formattedDate = (date: Date | string) => {
  const dateFormat = isSameYear(new Date(), date) ? "dd MMM" : "dd MMM yyyy";
  return format(date, dateFormat);
};
