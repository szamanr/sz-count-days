import {
  differenceInCalendarDays,
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
import { SavedDate, Settings } from "app/DaysTracker/types";

const diff = (start: string, end: string, displayDurationInDays: boolean) => {
  if (displayDurationInDays)
    return `${differenceInCalendarDays(end, start)} days`;
  return formatDuration(
    pick(intervalToDuration({ end, start }), [
      "years",
      "months",
      "weeks",
      "days",
    ]),
  );
};

type Props = SavedDate & {
  class?: string;
  settings: Settings;
};

export const Day = (props: Props) => {
  const date = format(props.date, "dd MMM yyyy");
  const endDate =
    props.endDate && isAfter(props.endDate, props.date)
      ? format(props.endDate, "dd MMM yyyy")
      : undefined;

  const now = format(new Date(), "dd MMM yyyy");

  if (isFuture(date)) {
    return (
      <p class={props.class} data-testid="day">
        <span>It's </span>
        <span>{diff(now, date, props.settings.displayDurationInDays)}</span>
        <span> until </span>
        <Show when={props.name} fallback={date}>
          <Strong>{props.name}</Strong>
          <Show when={endDate} fallback={<span> ({date})</span>}>
            {(endDate) => (
              <span>
                {" "}
                ({date} - {endDate()},{" "}
                {diff(date, endDate(), props.settings.displayDurationInDays)})
              </span>
            )}
          </Show>
        </Show>
      </p>
    );
  }

  const past = (!!endDate && isPast(endDate)) || (!endDate && isPast(date));
  if (past) {
    return (
      <p class={props.class} data-testid="day">
        <span>It's been </span>
        <span>
          {diff(endDate ?? date, now, props.settings.displayDurationInDays)}
        </span>
        <span> since </span>
        <Show when={props.name} fallback={endDate ?? date}>
          <Strong>{props.name}</Strong>
          <Show when={endDate} fallback={<span> ({date})</span>}>
            {(endDate) => (
              <span>
                {" "}
                ({date} - {endDate()},{" "}
                {diff(date, endDate(), props.settings.displayDurationInDays)})
              </span>
            )}
          </Show>
        </Show>
      </p>
    );
  }

  if (endDate) {
    return (
      <p class={props.class} data-testid="day">
        <span>It's been </span>
        <span>{diff(date, now, props.settings.displayDurationInDays)}</span>
        <span> since </span>
        <Show when={props.name} fallback={date}>
          <Strong>{props.name}</Strong>
        </Show>
        <span>, </span>
        <span>{diff(now, endDate, props.settings.displayDurationInDays)}</span>
        <span> more to go!</span>
        <span> ({format(endDate, "dd MMM yyyy")})</span>
      </p>
    );
  }

  return (
    <p class={props.class} data-testid="day">
      <Strong>{props.name ?? date}</Strong>
      <span> is today!</span>
    </p>
  );
};
