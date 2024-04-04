import { createSignal, For } from "solid-js";
import { SavedDate } from "./types";
import { Day } from "./Day";
import { AddDate } from "./AddDate";
import { Button } from "common/Button";
import { without } from "lodash";
import { Icon } from "common/Icon";

export const DaysTracker = () => {
  const localStorageDates: SavedDate[] = JSON.parse(
    window.localStorage.getItem("savedDates") ?? "[]",
  );
  const [dates, setDates] = createSignal(localStorageDates);

  const addDate = (date: SavedDate) => {
    const newDates = [...dates(), date];
    setDates(newDates);
    window.localStorage.setItem("savedDates", JSON.stringify(newDates));
  };

  const removeDate = (date: SavedDate) => {
    const newDates = without([...dates()], date);
    setDates(newDates);
    window.localStorage.setItem("savedDates", JSON.stringify(newDates));
  };

  const fallback = <p class="text-gray-500">Add a date below</p>;

  return (
    <main class="flex w-full flex-col items-center space-y-4 p-8">
      <ul class="space-y-2">
        <For each={dates()} fallback={fallback}>
          {(date) => (
            <li>
              <div class="group flex items-center space-x-1">
                <Button
                  class="invisible text-red-500 hover:text-red-800 group-hover:visible"
                  onClick={removeDate.bind(null, date)}
                  variant="negative"
                >
                  <Icon name="close" size="xl" />
                </Button>
                <Day date={date.date} name={date.name} />
              </div>
            </li>
          )}
        </For>
      </ul>
      <AddDate addDate={addDate} />
    </main>
  );
};
