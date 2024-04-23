import {
  addDays,
  differenceInCalendarDays,
  format,
  isAfter,
  isBefore,
  isSameDay,
} from "date-fns";
import { Strong } from "common/Strong";
import { JSX, Show } from "solid-js";
import { twClass } from "common/twClass";
import { SchengenDate } from "app/Schengen/types";
import { formattedDate } from "common/formattedDate";

const diff = (start: Date | string, end: Date | string) =>
  `${differenceInCalendarDays(end, start)} days`;

type Props = SchengenDate & {
  class?: string;
  daysRemainingAt: (date: Date | string) => number;
};

export const SchengenTrip = (props: Props) => {
  const now = format(new Date(), "yyyy-MM-dd");
  const endDate = isAfter(props.endDate, props.date) ? props.endDate : now;
  const endDateForDiff = () => addDays(endDate, 1);

  const duration = () => differenceInCalendarDays(endDateForDiff(), props.date);
  const formattedDuration = () => `${duration()} days`;

  const isOverstay = () => duration() > props.daysRemainingAt(props.date);
  const className = () =>
    isOverstay() ? twClass(props.class, "text-red-500") : props.class;
  const error = () =>
    isOverstay() ? (
      <span class="block text-sm">
        Cannot stay longer than {props.daysRemainingAt(props.date)} days.
      </span>
    ) : undefined;

  let relativeDuration: JSX.Element;

  const isFuture = isAfter(props.date, now);
  const isPast = isBefore(endDate, now);

  if (isFuture) {
    relativeDuration = (
      <>
        <span>It's </span>
        <span>{diff(now, props.date)}</span>
        <span> until </span>
        <Show when={props.name} fallback={<span>trip</span>}>
          <Strong>{props.name}</Strong>
        </Show>
      </>
    );
  } else if (isPast) {
    relativeDuration = (
      <>
        <span>It's been </span>
        <span>{diff(endDateForDiff(), now)}</span>
        <span> since </span>
        <Show when={props.name} fallback={<span>trip</span>}>
          <Strong>{props.name}</Strong>
        </Show>
      </>
    );
  }
  // else: is present
  else {
    relativeDuration = (
      <>
        <Show when={!isSameDay(props.date, now)}>
          <span>It's been </span>
          <span>{diff(props.date, now)}</span>
          <span> since </span>
        </Show>
        <Show when={props.name} fallback={<span>trip</span>}>
          <Strong>{props.name}</Strong>
        </Show>
        <Show when={isSameDay(props.date, now)}>
          <span> starts today</span>
        </Show>
        <span>, </span>
        <span>{diff(now, endDateForDiff()!)}</span>
        <span> remaining</span>
      </>
    );
  }

  return (
    <p class={className()} data-testid="day">
      {relativeDuration}
      <span>
        {" "}
        ({formattedDate(props.date)} - {formattedDate(endDate)},{" "}
        {formattedDuration()})
      </span>
      {error()}
    </p>
  );
};
