import { Accessor, Component, Index, Show } from "solid-js";
import {
  addDays,
  differenceInCalendarDays,
  format,
  isToday,
  isWithinInterval,
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

  const trips = (): Trip[] =>
    props.dates().map((date) => ({
      ...date,
      endDate: date.endDate || now,
      duration: 1 + differenceInCalendarDays(date.endDate || now, date.date),
    }));
  const { daysRemainingAt } = useTrips(trips);

  const overlaps = (date: Date) =>
    trips().filter((trip) =>
      isWithinInterval(date, {
        start: trip.date,
        end: trip.endDate,
      }),
    ).length > 0;

  const availableEnterDates = () => {
    const enterDates: Trip[] = [];

    for (let i = 0; i < 365; i++) {
      const potentialEnterDate = addDays(now, i);
      if (overlaps(potentialEnterDate)) continue;

      const remaining = daysRemainingAt(potentialEnterDate);
      if (!enterDates.at(-1) || enterDates.at(-1)?.duration !== remaining) {
        enterDates.push({
          date: format(potentialEnterDate, "yyyy-MM-dd"),
          duration: remaining,
          endDate: format(
            addDays(potentialEnterDate, remaining - 1),
            "yyyy-MM-dd",
          ),
        });
      }
    }

    return enterDates;
  };

  return (
    <div class="space-y-1">
      <Index each={availableEnterDates()}>
        {(date) => {
          return (
            <p>
              <Show when={isToday(date().date)}>
                <span>
                  If you enter today ({formattedDate(date().date)}), you can
                  stay for{" "}
                </span>
              </Show>
              <Show when={!isToday(date().date)}>
                <span>
                  If you enter on {formattedDate(date().date)}, you can stay for{" "}
                </span>
              </Show>
              <Strong>{date().duration}</Strong>
              <span> days, until </span>
              <span>{formattedDate(date().endDate)}</span>
            </p>
          );
        }}
      </Index>
    </div>
  );
};
