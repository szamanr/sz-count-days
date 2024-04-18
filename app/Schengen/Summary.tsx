import { Accessor, Component, createSignal, Index, Show } from "solid-js";
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
import { Input } from "common/Input";

type Trip = SchengenDate & { duration: number };

type Props = {
  dates: Accessor<SchengenDate[]>;
};

export const Summary: Component<Props> = (props) => {
  const now = format(new Date(), "yyyy-MM-dd");

  const [myEnterDate, setMyEnterDate] = createSignal<string>();

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
    <div class="space-y-2">
      <p class="grid grid-cols-3 space-x-4 font-semibold">
        <span>If you enter on</span>
        <span>you can stay for</span>
        <span>until</span>
      </p>
      <Index each={availableEnterDates()}>
        {(date) => {
          return (
            <p class="grid grid-cols-3 space-x-4 odd:text-stone-400">
              <Show when={isToday(date().date)}>
                <span>Today ({formattedDate(date().date)})</span>
              </Show>
              <Show when={!isToday(date().date)}>
                <span>{formattedDate(date().date)}</span>
              </Show>
              <span>
                <Strong>{date().duration}</Strong>
                <span> days</span>
              </span>
              <span>{formattedDate(date().endDate)}</span>
            </p>
          );
        }}
      </Index>
      <p class="flex flex-col gap-4 py-2 odd:text-stone-400 sm:grid sm:grid-cols-3 sm:space-x-2">
        <Input
          class="w-48"
          type="date"
          value={myEnterDate()}
          onChange={(e) => setMyEnterDate(e.target.value)}
        />
        <Show when={myEnterDate()}>
          {(myDate) => {
            const remaining = daysRemainingAt(myDate());
            return (
              <>
                <span>{remaining} days</span>
                <span>{formattedDate(addDays(myDate(), remaining - 1))}</span>
              </>
            );
          }}
        </Show>
      </p>
    </div>
  );
};
