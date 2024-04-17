import {
  addDays,
  differenceInCalendarDays,
  format,
  isAfter,
  isBefore,
  isSameDay,
} from "date-fns";
import { Strong } from "common/Strong";
import { Show } from "solid-js";
import { twClass } from "common/twClass";
import { SchengenDate } from "app/Schengen/types";

const diff = (start: string, end: string) =>
  `${differenceInCalendarDays(end, start)} days`;

type Props = SchengenDate & {
  class?: string;
};

export const SchengenTrip = (props: Props) => {
  const now = format(new Date(), "dd MMM yyyy");
  const date = format(props.date, "dd MMM yyyy");
  const endDate = isAfter(props.endDate, props.date)
    ? format(props.endDate, "dd MMM yyyy")
    : now;
  const endDateForDiff = () => format(addDays(endDate, 1), "dd MMM yyyy");

  const duration = () => differenceInCalendarDays(endDateForDiff(), date);
  const formattedDuration = () => `${duration()} days`;
  const isOverdue90 = () => duration() > 90;
  const className = () =>
    isOverdue90() ? twClass(props.class, "text-red-500") : props.class;

  const isFuture = isAfter(date, now);
  if (isFuture) {
    return (
      <p class={className()} data-testid="day">
        <span>It's </span>
        <span>{diff(now, date)}</span>
        <span> until </span>
        <Show when={props.name} fallback={date}>
          <Strong>{props.name}</Strong>
          <span>
            {" "}
            ({date} - {endDate}, {formattedDuration()})
          </span>
        </Show>
      </p>
    );
  }

  const isPast = isBefore(endDate, now);
  if (isPast) {
    return (
      <p class={className()} data-testid="day">
        <span>It's been </span>
        <span>{diff(endDateForDiff(), now)}</span>
        <span> since </span>
        <Show when={props.name} fallback={endDate}>
          <Strong>{props.name}</Strong>
          <span>
            {" "}
            ({date} - {endDate}, {formattedDuration()})
          </span>
        </Show>
      </p>
    );
  }

  // else: is present
  return (
    <p class={className()} data-testid="day">
      <Show when={!isSameDay(date, now)}>
        <span>It's been </span>
        <span>{diff(date, now)}</span>
        <span> since </span>
      </Show>
      <Show when={props.name} fallback={date}>
        <Strong>{props.name}</Strong>
      </Show>
      <Show when={isSameDay(date, now)}>
        <span> starts today</span>
      </Show>
      <span>, </span>
      <span>{diff(now, endDateForDiff()!)}</span>
      <span> remaining</span>
      <span>
        {" "}
        ({date} - {endDate})
      </span>
    </p>
  );
};
