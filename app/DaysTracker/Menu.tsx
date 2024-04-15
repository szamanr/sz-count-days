import { Accessor, Component } from "solid-js";
import { toast } from "common/toast.ts";
import { Popover } from "@ark-ui/solid";
import { Button } from "common/Button";
import { Icon } from "common/Icon";
import { ConfirmButton } from "common/ConfirmButton";
import { SavedDate } from "app/DaysTracker/types";

type Props = {
  dates: Accessor<SavedDate[]>;
  displayDurationInDays: boolean;
  setDates: (dates: SavedDate[]) => void;
  toggleDisplayDurationInDays: () => void;
};

export const Menu: Component<Props> = (props) => {
  const removeAllDates = () => {
    props.setDates([]);
  };

  const shareAllDates = async () => {
    const newSearchParams = new URLSearchParams();

    props.dates().forEach((date) => {
      newSearchParams.append(
        "date",
        [date.date, date.endDate, date.name].filter((v) => !!v).join(" "),
      );
    });
    history.pushState(null, "", `/?${newSearchParams.toString()}`);
    await navigator.clipboard.writeText(location.href);
    toast("URL copied to clipboard.");
  };

  return (
    <Popover.Root
      positioning={{
        offset: {
          mainAxis: 32,
        },
      }}
    >
      <Popover.Positioner>
        <Popover.Content>
          <div class="flex w-64 flex-col space-y-4 rounded bg-gray-600 py-4">
            <div class="flex w-full flex-col items-center space-y-2 border-b pb-2">
              <p>
                <span>Displaying as </span>
                <span class="italic">
                  {props.displayDurationInDays ? "81 days" : "2 months 20 days"}
                </span>
              </p>
              <Button
                onClick={props.toggleDisplayDurationInDays}
                variant="negative"
              >
                <Icon
                  class="text-teal-400 hover:text-teal-800"
                  name="swap_horiz"
                  size="xl"
                />
                <span>Toggle</span>
              </Button>
            </div>
            <Button
              class="flex w-full items-center justify-center disabled:text-gray-400"
              disabled={props.dates().length < 1}
              onClick={shareAllDates}
              variant="negative"
            >
              <Icon
                class="text-teal-400 hover:text-teal-800"
                name="share"
                size="xl"
              />
              <span>Share all</span>
            </Button>
            <ConfirmButton
              class="flex w-full items-center justify-center disabled:text-gray-400"
              disabled={props.dates().length < 1}
              onClick={removeAllDates}
              messages={{
                prompt: null,
                no: "Cancel",
                yes: "Delete",
              }}
              variant="negative"
            >
              <Icon
                class="text-red-500 hover:text-red-800"
                name="delete"
                size="xl"
              />
              <span>Delete all</span>
            </ConfirmButton>
          </div>
        </Popover.Content>
      </Popover.Positioner>
      <div class="absolute bottom-0 right-0 flex flex-col items-end space-y-1 p-4">
        <Popover.Trigger class="rounded bg-teal-600 p-2 leading-none hover:bg-teal-400">
          <Icon class="" name="menu" size="2xl" />
        </Popover.Trigger>
      </div>
    </Popover.Root>
  );
};
