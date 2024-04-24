import { isMatch } from "date-fns";
import { SavedDate } from "app/DaysTracker/types";

export const useQueryDates = <DateType extends SavedDate>(): DateType[] => {
  const searchParams = new URLSearchParams(document.location.search);
  return searchParams
    .getAll("date")
    .map(
      (date) =>
        date.match(
          /(?<date>\d{4}-\d{2}-\d{2})( (?<endDate>\d{4}-\d{2}-\d{2}))?( (?<name>.*))?/,
        )?.groups as DateType,
    )
    .filter((date) => !!date)
    .filter(({ date }) => isMatch(date, "yyyy-MM-dd"))
    .filter(({ endDate }) => !endDate || isMatch(endDate, "yyyy-MM-dd"));
};
