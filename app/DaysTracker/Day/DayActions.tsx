import { Accessor, Show } from "solid-js";
import { SavedDate } from "app/DaysTracker/types";
import { without } from "lodash";
import { toast } from "common/toast";
import { Button } from "common/Button";
import { Icon } from "common/Icon";

type Props = {
  date: SavedDate;
  dates: Accessor<SavedDate[]>;
  index: Accessor<number>;
  setDates: (dates: SavedDate[]) => void;
};

export const DayActions = (props: Props) => {
  const moveDate = (date: SavedDate, offset: 1 | -1) => {
    let newDates = [...props.dates()];
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
    props.setDates(newDates);
  };

  const removeDate = (date: SavedDate) => {
    const newDates = without([...props.dates()], date);
    props.setDates(newDates);
  };

  const shareDate = async (date: SavedDate) => {
    const newSearchParams = new URLSearchParams({
      date: [date.date, date.endDate, date.name].filter((v) => !!v).join(" "),
    });
    history.pushState(null, "", `/?${newSearchParams.toString()}`);
    await navigator.clipboard.writeText(location.href);
    toast("URL copied to clipboard.");
  };

  return (
    <>
      <Show when={props.index() > 0}>
        <Button
          class="text-teal-500 hover:text-teal-400"
          onClick={moveDate.bind(null, props.date, -1)}
          variant="negative"
        >
          <Icon class="!text-2xl sm:!text-xl" name="arrow_upward" size="xl" />
        </Button>
      </Show>
      <Show when={props.index() < props.dates().length - 1}>
        <Button
          class="text-teal-500 hover:text-teal-400"
          onClick={moveDate.bind(null, props.date, 1)}
          variant="negative"
        >
          <Icon class="!text-2xl sm:!text-xl" name="arrow_downward" size="xl" />
        </Button>
      </Show>
      <Button
        class="text-teal-500 hover:text-teal-400"
        onClick={shareDate.bind(null, props.date)}
        variant="negative"
      >
        <Icon class="!text-2xl sm:!text-xl" name="share" size="xl" />
      </Button>
      <Button
        class="text-red-500 hover:text-red-400"
        onClick={removeDate.bind(null, props.date)}
        variant="negative"
      >
        <Icon class="!text-2xl sm:!text-xl" name="close" size="xl" />
      </Button>
    </>
  );
};
