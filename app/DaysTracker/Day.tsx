import {
  format,
  formatDuration,
  intervalToDuration,
  isAfter,
  isFuture,
  isPast,
} from "date-fns";
import { pick } from "lodash";
import { Strong } from "common/Strong";
import { Show } from "solid-js";
import { SavedDate } from "./types";

const diff = (start: string, end: string) =>
  formatDuration(
    pick(intervalToDuration({ end, start }), [
      "years",
      "months",
      "weeks",
      "days",
    ]),
  );

type Props = SavedDate & {
  class?: string;
};

export const Day = (props: Props) => {
  const date = format(props.date, "yyyy-MM-dd");
  const endDate =
    props.endDate && isAfter(props.endDate, props.date)
      ? format(props.endDate, "yyyy-MM-dd")
      : undefined;
  const duration = endDate && diff(date, endDate);

  const now = format(new Date(), "yyyy-MM-dd");

  const pickedDateFormatted = endDate
    ? `${format(date, "dd MMM yyyy")} - ${format(endDate, "dd MMM yyyy")}, ${duration}`
    : format(date, "dd MMM yyyy");

  if (isFuture(date)) {
    return (
      <p class={props.class}>
        <span>It's </span>
        <span>{diff(now, date)}</span>
        <span> until </span>
        <Show when={props.name} fallback={pickedDateFormatted}>
          <Strong>{props.name}</Strong>
          <span> ({pickedDateFormatted})</span>
        </Show>
      </p>
    );
  }

  if ((endDate && isPast(endDate)) || (!endDate && isPast(date))) {
    return (
      <p>
        <span>It's been </span>
        <span>{diff(endDate ?? date, now)}</span>
        <span> since </span>
        <Show when={props.name} fallback={pickedDateFormatted}>
          <Strong>{props.name}</Strong>
          <span> ({pickedDateFormatted})</span>
        </Show>
      </p>
    );
  }

  if (endDate) {
    return (
      <p>
        <span>It's been </span>
        <span>{diff(date, now)}</span>
        <span> since </span>
        <Strong>{props.name ?? format(date, "dd MMM yyyy")}</Strong>
        <span>, </span>
        <span>{diff(now, endDate)}</span>
        <span> more to go!</span>
        <span> ({format(endDate, "dd MMM yyyy")})</span>
      </p>
    );
  }

  return (
    <p>
      <Strong>{props.name ?? pickedDateFormatted}</Strong>
      <span> is today!</span>
    </p>
  );
};
