import { createSignal, For } from "solid-js";
import { unionBy } from "lodash";
import "toastify-js/src/toastify.css";
import { useQueryDates } from "app/DaysTracker/useQueryDates";
import { SavedDate } from "app/DaysTracker/types";
import { DayActions } from "app/DaysTracker/Day/DayActions";
import { AddDate } from "app/DaysTracker/AddDate";
import { Menu } from "app/DaysTracker/Menu";
import { SchengenDay } from "app/Schengen/SchengenDay";

export const Schengen = () => {
  const queryDates = useQueryDates();

  const localStorageDates: SavedDate[] = JSON.parse(
    window.localStorage.getItem("schengenDates") ?? "[]",
  );
  const allDates = unionBy(
    queryDates,
    localStorageDates,
    ({ date, endDate, name }) => [date, endDate, name].join(","),
  );
  if (allDates.length !== localStorageDates.length) {
    window.localStorage.setItem("schengenDates", JSON.stringify(allDates));
  }
  history.replaceState(null, "", location.pathname);

  const [dates, setDatesState] = createSignal(allDates);
  const setDates = (newDates: SavedDate[]) => {
    setDatesState(newDates);
    if (newDates.length) {
      window.localStorage.setItem("schengenDates", JSON.stringify(newDates));
    } else {
      window.localStorage.removeItem("schengenDates");
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
                <SchengenDay
                  date={date.date}
                  endDate={date.endDate}
                  name={date.name}
                />
              </div>
            </li>
          )}
        </For>
      </ul>
      <AddDate dates={dates} setDates={setDates} expanded />
      <Menu dates={dates} setDates={setDates} />
    </main>
  );
};
