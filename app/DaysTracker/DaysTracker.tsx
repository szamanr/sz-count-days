import { For } from "solid-js";
import { SavedDate } from "./types";
import { Day } from "./Day";
import { AddDate } from "./AddDate";

export const DaysTracker = () => {
  const dates: SavedDate[] = JSON.parse(
    window.localStorage.getItem("savedDates") ?? "[]",
  );

  const fallback = <p>Add a date below</p>;

  return (
    <main class="flex w-full flex-col items-center space-y-4 p-8">
      <ul class="space-y-2">
        <For each={dates} fallback={fallback}>
          {(date) => (
            <li>
              <Day date={date.date} name={date.name} />
            </li>
          )}
        </For>
      </ul>
      <AddDate />
    </main>
  );
};
