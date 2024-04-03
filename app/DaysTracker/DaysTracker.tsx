import { For } from "solid-js";
import { SavedDate } from "./types";
import { Day } from "./Day";

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
