import {
  compareAsc,
  differenceInCalendarDays,
  format,
  formatDuration,
  intervalToDuration,
} from "date-fns";
import { pick } from "lodash";
import { Strong } from "common/Strong";
import { Show } from "solid-js";
import { SavedDate } from "./types";

type Props = SavedDate & {
  class?: string;
};

export const Day = (props: Props) => {
  const date = format(props.date, "yyyy-MM-dd");
  const now = format(new Date(), "yyyy-MM-dd");
  const [firstDate, secondDate] = [date, now].sort(compareAsc);

  const difference = differenceInCalendarDays(now, date);

  const formattedDifference = formatDuration(
    pick(intervalToDuration({ end: secondDate, start: firstDate }), [
      "years",
      "months",
      "weeks",
      "days",
    ]),
  );

  const pickedDateFormatted = format(date, "dd MMM yyyy");

  if (difference === 0)
    return (
      <p>
        <Strong>{props.name ?? pickedDateFormatted}</Strong>
        <span> is today!</span>
      </p>
    );

  if (difference < 0)
    return (
      <p class={props.class}>
        <span>It's </span>
        <span>{formattedDifference}</span>
        <span> until </span>
        <Show when={props.name} fallback={pickedDateFormatted}>
          <Strong>{props.name}</Strong>
          <span> ({pickedDateFormatted})</span>
        </Show>
      </p>
    );

  return (
    <p>
      <span>It's been </span>
      <span>{formattedDifference}</span>
      <span> since </span>
      <Show when={props.name} fallback={pickedDateFormatted}>
        <Strong>{props.name}</Strong>
        <span> ({pickedDateFormatted})</span>
      </Show>
    </p>
  );
};
