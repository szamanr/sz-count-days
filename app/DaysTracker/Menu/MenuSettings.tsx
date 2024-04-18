import { Button } from "common/Button";
import { Icon } from "common/Icon";
import { Component } from "solid-js";
import { Settings } from "app/DaysTracker/types";

type Props = {
  settings: Settings;
  toggleDisplayDurationInDays: () => void;
  toggleIncludeLastDay: () => void;
};

export const MenuSettings: Component<Props> = (props) => (
  <div class="flex w-full flex-col items-center space-y-2 border-b pb-2">
    <div>
      <label class="space-x-1">
        <input
          type="checkbox"
          onClick={props.toggleIncludeLastDay}
          checked={props.settings.includeLastDay}
        />
        <span>Include last day</span>
      </label>
    </div>
    <div>
      <p>
        <span>Displaying as </span>
        <span class="italic">
          {props.settings.displayDurationInDays
            ? "81 days"
            : "2 months 20 days"}
        </span>
      </p>
      <Button onClick={props.toggleDisplayDurationInDays} variant="negative">
        <Icon
          class="text-teal-400 hover:text-teal-800"
          name="swap_horiz"
          size="xl"
        />
        <span>Toggle</span>
      </Button>
    </div>
  </div>
);
