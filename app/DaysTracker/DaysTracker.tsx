import { createSignal, For } from "solid-js";
import { SavedDate } from "./types";
import { Day } from "./Day";
import { AddDate } from "./AddDate";
import { Button } from "common/Button";
import { unionBy, without } from "lodash";
import { Icon } from "common/Icon";
import { isMatch } from "date-fns";

const useQueryDates = () => {
  const searchParams = new URLSearchParams(document.location.search);
  return searchParams
    .getAll("date")
    .map(
      (date) =>
        date.match(/(?<date>\d{4}-\d{2}-\d{2})( (?<name>.*))?/)
          ?.groups as SavedDate,
    )
    .filter((date) => !!date)
    .filter(({ date }) => isMatch(date, "yyyy-MM-dd"));
};

export const DaysTracker = () => {
  const queryDates = useQueryDates();

  const localStorageDates: SavedDate[] = JSON.parse(
    window.localStorage.getItem("savedDates") ?? "[]",
  );
  const allDates = unionBy(queryDates, localStorageDates, ({ date, name }) =>
    [date, name].join(","),
  );
  if (allDates.length !== localStorageDates.length) {
    window.localStorage.setItem("savedDates", JSON.stringify(allDates));
  }
  history.replaceState(null, "", "/");

  const [dates, setDates] = createSignal(allDates);

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
