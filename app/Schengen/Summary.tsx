import { Accessor, Component, For } from "solid-js";
import {
  addDays,
  areIntervalsOverlapping,
  differenceInCalendarDays,
  format,
  isAfter,
  isPast,
  isSameYear,
  subDays,
} from "date-fns";
import { Strong } from "common/Strong";
import { SchengenDate } from "app/Schengen/types";

const dateFormat = (date: Date) =>
  isSameYear(new Date(), date) ? "dd MMM" : "dd MMM yyyy";

type DateWithDuration = SchengenDate & { duration: number };

type Props = {
  dates: Accessor<SchengenDate[]>;
};

export const Summary: Component<Props> = (props) => {
  const now = format(new Date(), "yyyy-MM-dd");
  const cutoff = format(subDays(now, 180), "yyyy-MM-dd");

  const dates = (): DateWithDuration[] =>
    props
      .dates()
      .filter(({ date, endDate }) =>
        endDate ? isAfter(endDate, cutoff) : isAfter(date, cutoff),
      )
      .map((date) => ({
        ...date,
        duration: differenceInCalendarDays(
          date.endDate
            ? format(addDays(date.endDate, 1), "yyyy-MM-dd")
            : format(addDays(now, 1), "yyyy-MM-ddy"),
          date.date,
        ),
      }));

  const remainingDays = (trips: DateWithDuration[]) => {
    const usedDays = trips.reduce((sum, { duration }) => sum + duration, 0);
    return Math.max(0, 90 - usedDays);
  };
  let allRemainingDays = remainingDays(dates());

  const daysRemainingToday = () =>
    Math.min(
      90,
      remainingDays(
        dates().filter(({ date, endDate }) => isPast(date) && isPast(endDate)),
      ),
    );
  const exitDateToday = () => addDays(now, daysRemainingToday());

  return (
    <div class="space-y-1">
      <p>
        <span>
          If you enter today ({format(now, "dd MMM")}), you can stay for{" "}
        </span>
        <Strong>{daysRemainingToday()}</Strong>
        <span> days, until </span>
        <span>{format(exitDateToday(), dateFormat(exitDateToday()))}</span>
      </p>
      <For each={dates().filter(({ endDate }) => !!endDate)}>
        {(date, index) => {
          allRemainingDays += date.duration;
          let exitDate = addDays(date.endDate!, 180);
          let entranceDate = subDays(exitDate, allRemainingDays - 1);
          const nextDate = dates()[index() + 1];
          if (
            nextDate &&
            areIntervalsOverlapping(
              { start: nextDate.date, end: nextDate.endDate },
              {
                start: entranceDate,
                end: exitDate,
              },
            )
          ) {
            entranceDate = addDays(nextDate.endDate, 1);
            exitDate = addDays(entranceDate, allRemainingDays);
          }

          return (
            <p>
              <span>
                If you enter on {format(entranceDate, dateFormat(entranceDate))}
                , you can stay for{" "}
              </span>
              <Strong>{Math.min(90, allRemainingDays)}</Strong>
              <span> days, until </span>
              <span>{format(exitDate, dateFormat(exitDate))}</span>
            </p>
          );
        }}
      </For>
    </div>
  );
};
