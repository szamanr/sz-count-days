import {
  addDays,
  differenceInCalendarDays,
  format,
  isAfter,
  isBefore,
} from "date-fns";
import { Strong } from "common/Strong";
import { Show } from "solid-js";
import { SavedDate } from "app/DaysTracker/types";
import { twClass } from "common/twClass";

const diff = (start: string, end: string) =>
  `${differenceInCalendarDays(end, start)} days`;

type Props = SavedDate & {
  class?: string;
};

export const SchengenDay = (props: Props) => {
  const date = format(props.date, "dd MMM yyyy");
  const endDate =
    props.endDate && isAfter(props.endDate, props.date)
      ? format(props.endDate, "dd MMM yyyy")
      : undefined;
  const endDateForDiff = () =>
    endDate ? format(addDays(endDate, 1), "dd MMM yyyy") : undefined;

  const now = format(new Date(), "dd MMM yyyy");

  const isFuture = isAfter(date, now);

  const duration = () =>
    differenceInCalendarDays(endDateForDiff() ?? now, date);
  const formattedDuration = () => `${duration()} days`;
  const isOverdue90 = () => duration() > 90;
  const className = () =>
    isOverdue90() ? twClass(props.class, "text-red-500") : props.class;

  if (isFuture) {
    return (
      <p class={className()} data-testid="day">
        <span>It's </span>
        <span>{diff(now, date)}</span>
        <span> until </span>
        <Show when={props.name} fallback={date}>
          <Strong>{props.name}</Strong>
          <Show when={endDate} fallback={<span> ({date})</span>}>
            {(endDate) => (
              <span>
                {" "}
                ({date} - {endDate()}, {formattedDuration()})
              </span>
            )}
          </Show>
        </Show>
      </p>
    );
  }

  const isPast =
    (!!endDate && isBefore(endDate, now)) || (!endDate && isBefore(date, now));
  if (isPast) {
    return (
      <p class={className()} data-testid="day">
        <span>It's been </span>
        <span>{diff(endDate ?? date, now)}</span>
        <span> since </span>
        <Show when={props.name} fallback={endDate ?? date}>
          <Strong>{props.name}</Strong>
          <Show when={endDate} fallback={<span> ({date})</span>}>
            {(endDate) => (
              <span>
                {" "}
                ({date} - {endDate()}, {formattedDuration()})
              </span>
            )}
          </Show>
        </Show>
      </p>
    );
  }

  if (endDate) {
    return (
      <p class={className()} data-testid="day">
        <span>It's been </span>
        <span>{diff(date, now)}</span>
        <span> since </span>
        <Show when={props.name} fallback={date}>
          <Strong>{props.name}</Strong>
        </Show>
        <span>, </span>
        <span>{diff(now, endDateForDiff()!)}</span>
        <span> more to go!</span>
        <span> ({format(endDate, "dd MMM yyyy")})</span>
      </p>
    );
  }

  return (
    <p class={className()} data-testid="day">
      <Strong>{props.name || date}</Strong>
      <span> is today!</span>
    </p>
  );
};
