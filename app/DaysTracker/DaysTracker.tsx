import { createSignal, For } from "solid-js";
import { SavedDate } from "./types";
import { Day } from "./Day";
import { unionBy } from "lodash";
import { isMatch } from "date-fns";
import "toastify-js/src/toastify.css";
import { AddDate } from "app/DaysTracker/AddDate.tsx";
import { Menu } from "app/DaysTracker/Menu.tsx";
import { DayActions } from "app/DaysTracker/DayActions.tsx";

const useQueryDates = () => {
  const searchParams = new URLSearchParams(document.location.search);
  return searchParams
    .getAll("date")
    .map(
      (date) =>
        date.match(
          /(?<date>\d{4}-\d{2}-\d{2})( (?<endDate>\d{4}-\d{2}-\d{2}))?( (?<name>.*))?/,
        )?.groups as SavedDate,
    )
    .filter((date) => !!date)
    .filter(({ date }) => isMatch(date, "yyyy-MM-dd"))
    .filter(({ endDate }) => !endDate || isMatch(endDate, "yyyy-MM-dd"));
};

export const DaysTracker = () => {
  const queryDates = useQueryDates();

  const localStorageDates: SavedDate[] = JSON.parse(
    window.localStorage.getItem("savedDates") ?? "[]",
  );
  const allDates = unionBy(
    queryDates,
    localStorageDates,
    ({ date, endDate, name }) => [date, endDate, name].join(","),
  );
  if (allDates.length !== localStorageDates.length) {
    window.localStorage.setItem("savedDates", JSON.stringify(allDates));
  }
  history.replaceState(null, "", "/");

  const [dates, setDates] = createSignal(allDates);

  const fallback = <p class="text-gray-500">Add a date below</p>;

  return (
    <main class="flex w-full flex-col items-center space-y-4 p-8">
      <ul class="space-y-2">
        <For each={dates()} fallback={fallback}>
          {(date, index) => (
            <li>
              <div class="group flex items-center space-x-1">
                <div class="flex w-32 justify-end">
                  <DayActions
                    index={index}
                    date={date}
                    dates={dates}
                    setDates={setDates}
                  />
                </div>
                <Day date={date.date} endDate={date.endDate} name={date.name} />
              </div>
            </li>
          )}
        </For>
      </ul>
      <AddDate dates={dates} setDates={setDates} />
      <Menu dates={dates} setDates={setDates} />
    </main>
  );
};
