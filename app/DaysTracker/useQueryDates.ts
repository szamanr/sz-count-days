import { SavedDate } from "app/DaysTracker/types.ts";
import { isMatch } from "date-fns";

export const useQueryDates = () => {
  const searchParams = new URLSearchParams(document.location.search);
  return searchParams
    .getAll("date")
    .map(
      (date) =>
        date.match(
          /(?<date>\d{4}-\d{2}-\d{2})( (?<endDate>\d{4}-\d{2}-\d{2}))?( (?<name>.*))?/,
        )?.groups as SavedDate,
    )
    .filter((date) => !!date)
    .filter(({ date }) => isMatch(date, "yyyy-MM-dd"))
    .filter(({ endDate }) => !endDate || isMatch(endDate, "yyyy-MM-dd"));
};
