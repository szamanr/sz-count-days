import { Popover } from "@ark-ui/solid";
import { Accessor, Component } from "solid-js";
import { Icon } from "common/Icon";
import { DateFormContent } from "./DateFormContent";
import { SavedDate } from "./types";

type Props = {
  dates: Accessor<SavedDate[]>;
  setDates: (dates: SavedDate[]) => void;
};

export const AddDate: Component<Props> = (props) => {
  return (
    <Popover.Root>
      <Popover.Trigger class="flex rounded-full bg-teal-500 p-2 hover:bg-teal-400">
        <Icon class="!font-semibold" name="add" size="2xl" />
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content class="z-10 min-w-96 rounded bg-gray-600 p-4">
          <DateFormContent
            onSubmit={(values) => {
              props.setDates([...props.dates(), values]);
            }}
          />
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  );
};
