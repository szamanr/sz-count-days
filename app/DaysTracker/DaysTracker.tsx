import {
  compareAsc,
  differenceInCalendarDays,
  format,
  formatDuration,
  intervalToDuration,
} from "date-fns";
import { pick } from "lodash";
import { For, Show } from "solid-js";
import { Strong } from "../../common/Strong.tsx";

type SavedDate = {
  date: string;
  name?: string;
};
const Day = ({ date: dateProp, name }: SavedDate) => {
  const date = format(dateProp, "yyyy-MM-dd");
  const now = format(new Date(), "yyyy-MM-dd");
  const [firstDate, secondDate] = [date, now].sort(compareAsc);

  const difference = differenceInCalendarDays(now, date);

  const formattedDifference = formatDuration(
    pick(intervalToDuration({ end: secondDate, start: firstDate }), [
      "years",
      "months",
      "weeks",
      "days",
    ]),
  );

  const pickedDateFormatted = format(date, "dd MMM yyyy");

  if (difference === 0)
    return (
      <p>
        <Strong>{name ?? pickedDateFormatted}</Strong>
        <span> is today!</span>
      </p>
    );

  if (difference < 0)
    return (
      <p>
        <span>It's </span>
        <span>{formattedDifference}</span>
        <span> until </span>
        <Show when={name} fallback={pickedDateFormatted}>
          <Strong>{name}</Strong>
          <span> ({pickedDateFormatted})</span>
        </Show>
      </p>
    );

  return (
    <p>
      <span>It's been </span>
      <span>{formattedDifference}</span>
      <span> since </span>
      <Show when={name} fallback={pickedDateFormatted}>
        <Strong>{name}</Strong>
        <span> ({pickedDateFormatted})</span>
      </Show>
    </p>
  );
};
export const DaysTracker = () => {
  const dates: SavedDate[] = [
    {
      date: "2024-01-13",
      name: "trip start",
    },
    {
      date: "2023-10-15",
    },
    {
      date: new Date().toString(),
    },
    {
      date: "2024-04-07",
      name: "local elections",
    },
  ];
  const fallback = <p>Add a date below</p>;

  return (
    <main class="w-full flex justify-center p-8">
      <ul class="space-y-2">
        <For each={dates} fallback={fallback}>
          {(date) => (
            <li>
              <Day date={date.date} name={date.name} />
            </li>
          )}
        </For>
      </ul>
    </main>
  );
};
