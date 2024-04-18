import { Accessor, Component, For, Show } from "solid-js";
import {
  addDays,
  areIntervalsOverlapping,
  differenceInCalendarDays,
  format,
  isBefore,
  isSameYear,
  max,
  min,
  subDays,
} from "date-fns";
import { Strong } from "common/Strong";
import { SchengenDate } from "app/Schengen/types";

const dateFormat = (date: Date | string) =>
  isSameYear(new Date(), date) ? "dd MMM" : "dd MMM yyyy";

type Trip = SchengenDate & { duration: number };

type Props = {
  dates: Accessor<SchengenDate[]>;
};

export const Summary: Component<Props> = (props) => {
  const now = format(new Date(), "yyyy-MM-dd");
  const startOfCurrent180DayWindow = subDays(now, 180 - 1);

  const trips = (): Trip[] =>
    props.dates().map((date) => ({
      ...date,
      duration:
        1 +
        differenceInCalendarDays(format(date.endDate, "yyyy-MM-dd"), date.date),
    }));

  const dates = (): Trip[] =>
    trips()
      // don't display dates which don't affect our available days budget as of today
      .filter((trip) => !isBefore(trip.endDate, startOfCurrent180DayWindow));

  const daysRemainingAt = (entranceDate: Date | string) => {
    let exitDate = entranceDate;
    let relevantTrips = trips()
      // remove future trips from calculation
      .filter((trip) => isBefore(trip.date, exitDate))
      .map((trip) => ({ ...trip, daysUed: 0 }));
    let duration = 0;

    while (duration < 90) {
      exitDate = addDays(entranceDate, duration);
      const startOfRolling180DayWindow = subDays(exitDate, 180 - 1);
      relevantTrips = relevantTrips
        // consider only trips which ended within our rolling window
        .filter((trip) => !isBefore(trip.endDate, startOfRolling180DayWindow))
        // calculate trip's used days within our rolling window
        .map((trip) => ({
          ...trip,
          daysUsed:
            differenceInCalendarDays(
              min([trip.endDate, exitDate]),
              max([trip.date, startOfRolling180DayWindow]),
            ) + 1,
        }));
      const used = relevantTrips.reduce(
        (sum, { daysUsed }) => sum + daysUsed,
        0,
      );

      if (used + duration >= 90) {
        return duration;
      } else {
        duration++;
      }
    }

    return duration;
  };

  const exitDateToday = () => addDays(now, daysRemainingAt(now));

  // TODO: this has the assumption that the reset date will be after today.
  // it's always true due to how we filter trips, but maybe there's a more generic solution.
  const remainingDaysFor = (dateIndex: number) => {
    let remaining = daysRemainingAt(now);
    for (let i = 0; i <= dateIndex; i++) {
      remaining += dates()[i].duration;
    }
    return Math.min(90, remaining);
  };

  const currentTrip = () =>
    dates().find(
      ({ date, endDate }) =>
        differenceInCalendarDays(now, date) >= 0 &&
        differenceInCalendarDays(endDate, now) >= 0,
    );

  return (
    <div class="space-y-1">
      <Show when={!currentTrip()}>
        <p>
          <span>
            If you enter today ({format(now, "dd MMM")}), you can stay for{" "}
          </span>
          <Strong>{daysRemainingAt(now)}</Strong>
          <span> days, until </span>
          <span>{format(exitDateToday(), dateFormat(exitDateToday()))}</span>
        </p>
      </Show>
      <Show when={currentTrip()}>
        {(trip) => {
          const entranceDate = addDays(trip().endDate, 1);
          const duration = daysRemainingAt(entranceDate);
          const exitDate = addDays(entranceDate, duration - 1);

          return (
            <p>
              <span>
                If you enter on {format(entranceDate, dateFormat(entranceDate))}
                , you can stay for{" "}
              </span>
              <Strong>{duration}</Strong>
              <span> days, until </span>
              <span>{format(exitDate, dateFormat(exitDate))}</span>
            </p>
          );
        }}
      </Show>
      <For each={dates()}>
        {(date, index) => {
          let remaining = remainingDaysFor(index());
          let exitDate = addDays(date.endDate, 180);
          let entranceDate = subDays(exitDate, remaining - 1);
          let i = index() + 1;
          while (
            dates()[i] &&
            areIntervalsOverlapping(
              { start: dates()[i].date, end: dates()[i].endDate },
              {
                start: entranceDate,
                end: exitDate,
              },
            )
          ) {
            remaining -= dates()[i].duration;
            entranceDate = addDays(dates()[i].endDate, 1);
            exitDate = addDays(entranceDate, remaining - 1);
            i++;
          }

          return (
            <p>
              <span>
                If you enter on {format(entranceDate, dateFormat(entranceDate))}
                , you can stay for{" "}
              </span>
              <Strong>{remaining}</Strong>
              <span> days, until </span>
              <span>{format(exitDate, dateFormat(exitDate))}</span>
            </p>
          );
        }}
      </For>
    </div>
  );
};
