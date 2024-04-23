import { createSignal, For } from "solid-js";
import { unionBy } from "lodash";
import "toastify-js/src/toastify.css";
import { useQueryDates } from "app/DaysTracker/useQueryDates";
import { DayActions } from "app/DaysTracker/Day/DayActions";
import { Menu } from "app/DaysTracker/Menu";
import { SchengenTrip } from "app/Schengen/SchengenTrip";
import { isAfter, isPast } from "date-fns";
import { Summary } from "app/Schengen/Summary";
import { SchengenDate } from "app/Schengen/types";
import { AddSchengenDate } from "app/Schengen/AddSchengenDate";
import { useTrips } from "app/Schengen/useTrips";

export const Schengen = () => {
  document.title = "Count Schengen Days";
  const queryDates = useQueryDates<SchengenDate>();

  const localStorageDates: SchengenDate[] = JSON.parse(
    window.localStorage.getItem("schengenDates") ?? "[]",
  );
  const allDates = unionBy(
    queryDates,
    localStorageDates,
    ({ date, endDate, name }) => [date, endDate, name].join(","),
  )
    .filter((date) => date.endDate || isPast(date.date))
    .sort((a, b) => (isAfter(a.date, b.date) ? 1 : -1));
  if (allDates.length !== localStorageDates.length) {
    window.localStorage.setItem("schengenDates", JSON.stringify(allDates));
  }
  history.replaceState(null, "", location.pathname);

  const [dates, setDatesState] = createSignal(allDates);
  const { daysRemainingAt } = useTrips(dates);
  const setDates = (newDates: SchengenDate[]) => {
    const orderedDates = [...newDates].sort((a, b) =>
      isAfter(a.date, b.date) ? 1 : -1,
    );
    setDatesState(orderedDates);
    if (newDates.length) {
      window.localStorage.setItem(
        "schengenDates",
        JSON.stringify(orderedDates),
      );
    } else {
      window.localStorage.removeItem("schengenDates");
    }
  };
  const resetDates = () => setDates([]);

  const fallback = <p class="text-gray-500">Add a trip below</p>;

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
                <SchengenTrip
                  trip={date}
                  otherTrips={dates}
                  daysRemainingAt={daysRemainingAt}
                />
              </div>
            </li>
          )}
        </For>
      </ul>
      <AddSchengenDate dates={dates} setDates={setDates} />
      <Summary dates={dates} />
      <Menu dates={dates} resetDates={resetDates} />
    </main>
  );
};
