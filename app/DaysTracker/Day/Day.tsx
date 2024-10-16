import {
  addDays,
  differenceInCalendarDays,
  format,
  formatDuration,
  intervalToDuration,
  isAfter,
  isBefore,
} from "date-fns";
import { pick } from "lodash";
import { Show } from "solid-js";
import { Settings } from "app/DaysTracker/types";
import { formattedDate } from "common/formattedDate";
import { Strong } from "common/Strong";
import { UTCDate } from "@date-fns/utc";

const diff = (
  start: Date | string,
  end: Date | string,
  displayDurationInDays: boolean,
) => {
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

type Props = {
  class?: string;
  date: UTCDate;
  endDate?: UTCDate;
  name?: string;
  settings: Settings;
};

export const Day = (props: Props) => {
  const endDate =
    props.endDate && isAfter(props.endDate, props.date)
      ? props.endDate
      : undefined;
  const endDateForDiff = () =>
    endDate
      ? props.settings.includeLastDay
        ? addDays(endDate, 1)
        : endDate
      : undefined;

  const now = format(new UTCDate(), "yyyy-MM-dd");

  const isFuture = isAfter(props.date, now);
  if (isFuture) {
    return (
      <p class={props.class} data-testid="day">
        <span>It's </span>
        <span>
          {diff(now, props.date, props.settings.displayDurationInDays)}
        </span>
        <span> until </span>
        <Show when={props.name} fallback={formattedDate(props.date)}>
          <Strong>{props.name}</Strong>
          <Show
            when={endDate}
            fallback={<span> ({formattedDate(props.date)})</span>}
          >
            {(endDate) => (
              <span>
                {" "}
                ({formattedDate(props.date)} - {formattedDate(endDate())},{" "}
                {diff(
                  props.date,
                  endDateForDiff()!,
                  props.settings.displayDurationInDays,
                )}
                )
              </span>
            )}
          </Show>
        </Show>
      </p>
    );
  }

  const isPast =
    (!!endDate && isBefore(endDate, now)) ||
    (!endDate && isBefore(props.date, now));
  if (isPast) {
    return (
      <p class={props.class} data-testid="day">
        <span>It's been </span>
        <span>
          {diff(
            endDate ?? props.date,
            now,
            props.settings.displayDurationInDays,
          )}
        </span>
        <span> since </span>
        <Show when={props.name} fallback={formattedDate(endDate ?? props.date)}>
          <Strong>{props.name}</Strong>
          <Show
            when={endDate}
            fallback={<span> ({formattedDate(props.date)})</span>}
          >
            {(endDate) => (
              <span>
                {" "}
                ({formattedDate(props.date)} - {formattedDate(endDate())},{" "}
                {diff(
                  props.date,
                  endDateForDiff()!,
                  props.settings.displayDurationInDays,
                )}
                )
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
        <span>
          {diff(props.date, now, props.settings.displayDurationInDays)}
        </span>
        <span> since </span>
        <Show when={props.name} fallback={formattedDate(props.date)}>
          <Strong>{props.name}</Strong>
        </Show>
        <span>, </span>
        <span>
          {diff(now, endDateForDiff()!, props.settings.displayDurationInDays)}
        </span>
        <span> more to go!</span>
        <span>
          {" "}
          ({formattedDate(props.date)} - {formattedDate(endDate)})
        </span>
      </p>
    );
  }

  return (
    <p class={props.class} data-testid="day">
      <Strong>{props.name || formattedDate(props.date)}</Strong>
      <span> is today!</span>
    </p>
  );
};
