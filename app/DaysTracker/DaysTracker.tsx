import { createSignal, For, Show } from "solid-js";
import { SavedDate } from "./types";
import { Day } from "./Day";
import { Button } from "common/Button";
import { toast } from "common/toast";
import { unionBy, without } from "lodash";
import { Icon } from "common/Icon";
import { isMatch } from "date-fns";
import "toastify-js/src/toastify.css";
import { AddDate } from "app/DaysTracker/AddDate.tsx";
import { Menu } from "app/DaysTracker/Menu.tsx";

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

  const removeDate = (date: SavedDate) => {
    const newDates = without([...dates()], date);
    setDates(newDates);
    window.localStorage.setItem("savedDates", JSON.stringify(newDates));
  };

  const shareDate = async (date: SavedDate) => {
    const newSearchParams = new URLSearchParams({
      date: [date.date, date.endDate, date.name].filter((v) => !!v).join(" "),
    });
    history.pushState(null, "", `/?${newSearchParams.toString()}`);
    await navigator.clipboard.writeText(location.href);
    toast("URL copied to clipboard.");
  };

  const moveDate = (date: SavedDate, offset: 1 | -1) => {
    let newDates = [...dates()];
    const index = newDates.indexOf(date);
    if (index < 0 || index + offset < 0 || index + offset >= newDates.length) {
      return;
    }

    newDates = [...newDates.slice(0, index), ...newDates.slice(index + 1)];
    newDates = [
      ...newDates.slice(0, index + offset),
      date,
      ...newDates.slice(index + offset),
    ];
    setDates(newDates);
    window.localStorage.setItem("savedDates", JSON.stringify(newDates));
  };

  const fallback = <p class="text-gray-500">Add a date below</p>;

  return (
    <main class="flex w-full flex-col items-center space-y-4 p-8">
      <ul class="space-y-2">
        <For each={dates()} fallback={fallback}>
          {(date, index) => (
            <li>
              <div class="group flex items-center space-x-1">
                <div class="flex w-32 justify-end">
                  <Show when={index() > 0}>
                    <Button
                      class="invisible text-teal-500 hover:text-teal-400 group-hover:visible"
                      onClick={moveDate.bind(null, date, -1)}
                      variant="negative"
                    >
                      <Icon name="arrow_upward" size="xl" />
                    </Button>
                  </Show>
                  <Show when={index() < dates().length - 1}>
                    <Button
                      class="invisible text-teal-500 hover:text-teal-400 group-hover:visible"
                      onClick={moveDate.bind(null, date, 1)}
                      variant="negative"
                    >
                      <Icon name="arrow_downward" size="xl" />
                    </Button>
                  </Show>
                  <Button
                    class="invisible text-teal-500 hover:text-teal-400 group-hover:visible"
                    onClick={shareDate.bind(null, date)}
                    variant="negative"
                  >
                    <Icon name="share" size="xl" />
                  </Button>
                  <Button
                    class="invisible text-red-500 hover:text-red-400 group-hover:visible"
                    onClick={removeDate.bind(null, date)}
                    variant="negative"
                  >
                    <Icon name="close" size="xl" />
                  </Button>
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
