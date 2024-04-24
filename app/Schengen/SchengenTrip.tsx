import {
  addDays,
  areIntervalsOverlapping,
  differenceInCalendarDays,
  format,
  isAfter,
  isBefore,
  isSameDay,
} from "date-fns";
import { isEqual } from "lodash";
import { Accessor, For, JSX, Show } from "solid-js";
import { SchengenDate } from "app/Schengen/types";
import { formattedDate } from "common/formattedDate";
import { Icon } from "common/Icon";
import { Strong } from "common/Strong";
import { twClass } from "common/twClass";

const diff = (start: Date | string, end: Date | string) =>
  `${differenceInCalendarDays(end, start)} days`;

type Props = {
  class?: string;
  daysRemainingAt: (date: Date | string) => number;
  trip: SchengenDate;
  otherTrips: Accessor<SchengenDate[]>;
};

export const SchengenTrip = (props: Props) => {
  const now = format(new Date(), "yyyy-MM-dd");
  const endDate = isAfter(props.trip.endDate, props.trip.date)
    ? props.trip.endDate
    : now;
  const endDateForDiff = () => addDays(endDate, 1);

  const duration = () =>
    differenceInCalendarDays(endDateForDiff(), props.trip.date);
  const formattedDuration = () => `${duration()} days`;

  const isOverstay = () => duration() > props.daysRemainingAt(props.trip.date);
  const className = () =>
    isOverstay() ? twClass(props.class, "text-red-500") : props.class;
  const error = () =>
    isOverstay() ? (
      <span class="block text-sm">
        Cannot stay longer than {props.daysRemainingAt(props.trip.date)} days.
      </span>
    ) : undefined;

  const overlappingTrips = () =>
    props
      .otherTrips()
      .filter((trip) => !isEqual(trip, props.trip))
      .filter((trip) =>
        areIntervalsOverlapping(
          { start: props.trip.date, end: endDate },
          {
            start: trip.date,
            end: trip.endDate,
          },
        ),
      );

  let relativeDuration: JSX.Element;

  const isFuture = isAfter(props.trip.date, now);
  const isPast = isBefore(endDate, now);

  if (isFuture) {
    relativeDuration = (
      <>
        <span>It's </span>
        <span>{diff(now, props.trip.date)}</span>
        <span> until </span>
        <Show when={props.trip.name} fallback={<span>trip</span>}>
          <Strong>{props.trip.name}</Strong>
        </Show>
      </>
    );
  } else if (isPast) {
    relativeDuration = (
      <>
        <span>It's been </span>
        <span>{diff(endDateForDiff(), now)}</span>
        <span> since </span>
        <Show when={props.trip.name} fallback={<span>trip</span>}>
          <Strong>{props.trip.name}</Strong>
        </Show>
      </>
    );
  }
  // else: is present
  else {
    relativeDuration = (
      <>
        <Show when={!isSameDay(props.trip.date, now)}>
          <span>It's been </span>
          <span>{diff(props.trip.date, now)}</span>
          <span> since </span>
        </Show>
        <Show when={props.trip.name} fallback={<span>trip</span>}>
          <Strong>{props.trip.name}</Strong>
        </Show>
        <Show when={isSameDay(props.trip.date, now)}>
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
        ({formattedDate(props.trip.date)} - {formattedDate(endDate)},{" "}
        {formattedDuration()})
      </span>
      {error()}
      <For each={overlappingTrips()}>
        {(trip) => {
          const tripDates = `${formattedDate(trip.date)} - ${formattedDate(trip.endDate)}`;
          return (
            <p class="flex items-center space-x-1 text-red-500">
              <Icon name="warning" />
              <span>overlaps with </span>
              <span>
                <Show when={trip.name} fallback={tripDates}>
                  {trip.name} ({tripDates})
                </Show>
              </span>
            </p>
          );
        }}
      </For>
    </p>
  );
};
