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
import { AddSchengenTrip } from "app/Schengen/AddSchengenTrip";
import { useTrips } from "app/Schengen/useTrips";

export const Schengen = () => {
  document.title = "Count Schengen Days";
  const queryTrips = useQueryDates<SchengenDate>();

  const localStorageTrips: SchengenDate[] = JSON.parse(
    window.localStorage.getItem("schengenDates") ?? "[]",
  );
  const allTrips = unionBy(
    queryTrips,
    localStorageTrips,
    ({ date, endDate, name }) => [date, endDate, name].join(","),
  )
    .filter((date) => date.endDate || isPast(date.date))
    .sort((a, b) => (isAfter(a.date, b.date) ? 1 : -1));
  if (allTrips.length !== localStorageTrips.length) {
    window.localStorage.setItem("schengenDates", JSON.stringify(allTrips));
  }
  history.replaceState(null, "", location.pathname);

  const [trips, setTripsState] = createSignal(allTrips);
  const { daysRemainingAt } = useTrips(trips);
  const setTrips = (newTrips: SchengenDate[]) => {
    const orderedTrips = [...newTrips].sort((a, b) =>
      isAfter(a.date, b.date) ? 1 : -1,
    );
    setTripsState(orderedTrips);
    if (newTrips.length) {
      window.localStorage.setItem(
        "schengenDates",
        JSON.stringify(orderedTrips),
      );
    } else {
      window.localStorage.removeItem("schengenDates");
    }
  };
  const resetTrips = () => setTrips([]);

  const fallback = <p class="text-gray-500">Add a trip below</p>;

  return (
    <main class="flex w-full flex-col items-center space-y-4 p-8">
      <ul class="space-y-2">
        <For each={trips()} fallback={fallback}>
          {(trip, index) => (
            <li>
              <div
                class="group flex flex-col-reverse space-x-1 sm:flex-row sm:items-center"
                data-testid="dayContainer"
              >
                <div class="invisible hidden w-32 shrink-0 justify-start group-hover:visible group-hover:flex sm:flex sm:justify-end">
                  <DayActions
                    index={index}
                    date={trip}
                    dates={trips}
                    setDates={setTrips}
                  />
                </div>
                <SchengenTrip
                  trip={trip}
                  otherTrips={trips}
                  daysRemainingAt={daysRemainingAt}
                />
              </div>
            </li>
          )}
        </For>
      </ul>
      <AddSchengenTrip trips={trips} setTrips={setTrips} />
      <Summary trips={trips} />
      <Menu dates={trips} resetDates={resetTrips} />
    </main>
  );
};
