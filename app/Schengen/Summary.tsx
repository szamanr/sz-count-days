import { Accessor, Component, For, Show } from "solid-js";
import {
  addDays,
  areIntervalsOverlapping,
  differenceInCalendarDays,
  format,
  isBefore,
  subDays,
} from "date-fns";
import { Strong } from "common/Strong";
import { SchengenDate } from "app/Schengen/types";
import { useTrips } from "app/Schengen/useTrips";
import { formattedDate } from "common/formattedDate";

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
  const { daysRemainingAt } = useTrips(trips);

  const dates = (): Trip[] =>
    trips()
      // don't display dates which don't affect our available days budget as of today
      .filter((trip) => !isBefore(trip.endDate, startOfCurrent180DayWindow));

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
          <span>{formattedDate(exitDateToday())}</span>
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
                If you enter on {formattedDate(entranceDate)}, you can stay for{" "}
              </span>
              <Strong>{duration}</Strong>
              <span> days, until </span>
              <span>{formattedDate(exitDate)}</span>
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
                If you enter on {formattedDate(entranceDate)}, you can stay for{" "}
              </span>
              <Strong>{remaining}</Strong>
              <span> days, until </span>
              <span>{formattedDate(exitDate)}</span>
            </p>
          );
        }}
      </For>
    </div>
  );
};
