import { Accessor, Component, createSignal, Index, Show } from "solid-js";
import { addDays, differenceInCalendarDays, format, isToday } from "date-fns";
import { Strong } from "common/Strong";
import { SchengenDate } from "app/Schengen/types";
import { useTrips } from "app/Schengen/useTrips";
import { formattedDate } from "common/formattedDate";
import { Input } from "common/Input";
import { OverlapTooltip } from "./OverlapTooltip";

type Trip = SchengenDate & { duration: number };

type Props = {
  dates: Accessor<SchengenDate[]>;
  overlappingTrips: (
    date: Date | string,
    endDate?: Date | string,
  ) => SchengenDate[];
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

  const availableEnterDates = () => {
    const enterDates: (Trip & {
      overlappingTrips: { name?: string; dates: string }[];
    })[] = [];

    for (let i = 0; i < 365; i++) {
      const potentialEnterDate = addDays(now, i);
      if (props.overlappingTrips(potentialEnterDate).length) continue;

      const remaining = daysRemainingAt(potentialEnterDate);

      if (enterDates.at(-1)?.duration === remaining) continue;

      const potentialEndDate = addDays(potentialEnterDate, remaining - 1);
      const overlappingTrips = props
        .overlappingTrips(potentialEnterDate, potentialEndDate)
        .map((trip) => ({
          name: trip.name,
          dates: [trip.date, trip.endDate]
            .map((date) => formattedDate(date))
            .join(" - "),
        }));

      enterDates.push({
        date: format(potentialEnterDate, "yyyy-MM-dd"),
        duration: remaining,
        endDate: format(potentialEndDate, "yyyy-MM-dd"),
        overlappingTrips,
      });
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
            <>
              <p class="grid grid-cols-3 space-x-4 odd:text-stone-400">
                <span class="flex items-center space-x-1">
                  <Show when={isToday(date().date)}>
                    <span>Today ({formattedDate(date().date)})</span>
                  </Show>
                  <Show when={!isToday(date().date)}>
                    <span>{formattedDate(date().date)}</span>
                  </Show>
                  <Show when={date().overlappingTrips.length}>
                    <OverlapTooltip trips={date().overlappingTrips} />
                  </Show>
                </span>
                <span>
                  <Strong>{date().duration}</Strong>
                  <span> days</span>
                </span>
                <span>{formattedDate(date().endDate)}</span>
              </p>
            </>
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
          {(myDate) => (
            <>
              <span>{daysRemainingAt(myDate())} days</span>
              <span>
                {formattedDate(
                  addDays(myDate(), daysRemainingAt(myDate()) - 1),
                )}
              </span>
            </>
          )}
        </Show>
      </p>
    </div>
  );
};
