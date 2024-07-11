import { without } from "lodash";
import { Accessor, Show } from "solid-js";
import { SavedDate } from "app/DaysTracker/types";
import { Button } from "common/Button";
import { Icon } from "common/Icon";
import { toast } from "common/toast";

type Props<DateType extends SavedDate> = {
  date: DateType;
  dates: Accessor<DateType[]>;
  index: Accessor<number>;
  reorder?: boolean;
  setDates: (dates: DateType[]) => void;
};

export const DayActions = <DateType extends SavedDate>(
  props: Props<DateType>,
) => {
  const moveDate = (offset: 1 | -1) => {
    let newDates = [...props.dates()];
    const index = newDates.indexOf(props.date);
    if (index < 0 || index + offset < 0 || index + offset >= newDates.length) {
      return;
    }

    newDates = [...newDates.slice(0, index), ...newDates.slice(index + 1)];
    newDates = [
      ...newDates.slice(0, index + offset),
      props.date,
      ...newDates.slice(index + offset),
    ];
    props.setDates(newDates);
  };

  const removeDate = () => {
    const newDates = without([...props.dates()], props.date);
    props.setDates(newDates);
  };

  const shareDate = async () => {
    const newSearchParams = new URLSearchParams({
      date: [props.date.date, props.date.endDate, props.date.name].filter((v) => !!v).join(" "),
    });
    history.pushState(
      null,
      "",
      `${location.pathname}?${newSearchParams.toString()}`,
    );
    await navigator.clipboard.writeText(location.href);
    toast("URL copied to clipboard.");
  };

  return (
    <>
      <Show when={props.reorder && props.index() > 0}>
        <Button
          class="text-teal-500 hover:text-teal-400"
          onClick={moveDate.bind(null, -1)}
          variant="negative"
        >
          <Icon class="!text-2xl sm:!text-xl" name="arrow_upward" size="xl" />
        </Button>
      </Show>
      <Show when={props.reorder && props.index() < props.dates().length - 1}>
        <Button
          class="text-teal-500 hover:text-teal-400"
          onClick={moveDate.bind(null, 1)}
          variant="negative"
        >
          <Icon class="!text-2xl sm:!text-xl" name="arrow_downward" size="xl" />
        </Button>
      </Show>
      <Button
        class="text-teal-500 hover:text-teal-400"
        onClick={shareDate}
        variant="negative"
      >
        <Icon class="!text-2xl sm:!text-xl" name="share" size="xl" />
      </Button>
      <Button
        class="text-red-500 hover:text-red-400"
        onClick={removeDate}
        variant="negative"
      >
        <Icon class="!text-2xl sm:!text-xl" name="close" size="xl" />
      </Button>
    </>
  );
};
