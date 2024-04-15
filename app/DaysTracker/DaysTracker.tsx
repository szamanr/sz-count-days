import { createSignal, For } from "solid-js";
import { SavedDate } from "./types";
import { Day } from "./Day/Day";
import { unionBy } from "lodash";
import "toastify-js/src/toastify.css";
import { AddDate } from "./AddDate";
import { Menu } from "./Menu";
import { DayActions } from "./Day/DayActions";
import { useQueryDates } from "./useQueryDates";

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

  const [dates, setDatesState] = createSignal(allDates);
  const setDates = (newDates: SavedDate[]) => {
    setDatesState(newDates);
    if (newDates.length) {
      window.localStorage.setItem("savedDates", JSON.stringify(newDates));
    } else {
      window.localStorage.removeItem("savedDates");
    }
  };

  const fallback = <p class="text-gray-500">Add a date below</p>;

  return (
    <main class="flex w-full flex-col items-center space-y-4 p-8">
      <ul class="space-y-2">
        <For each={dates()} fallback={fallback}>
          {(date, index) => (
            <li>
              <div
                class="group flex flex-col-reverse space-x-1 sm:flex-row sm:items-center"
                data-testid="dayContainer"
              >
                <div class="invisible hidden w-32 shrink-0 justify-start group-hover:visible group-hover:flex sm:flex sm:justify-end">
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
