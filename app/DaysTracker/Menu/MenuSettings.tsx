import { Component } from "solid-js";
import { Settings } from "app/DaysTracker/types";

type Props = {
  settings: Settings;
  setDisplayDurationInDays: (value: boolean) => void;
  toggleIncludeLastDay: () => void;
};

export const MenuSettings: Component<Props> = (props) => (
  <div class="flex w-full flex-col items-start space-y-2 border-b border-stone-300 px-2 pb-4">
    <div>
      <label class="space-x-2">
        <input
          type="checkbox"
          onClick={props.toggleIncludeLastDay}
          checked={props.settings.includeLastDay}
        />
        <span>Include last day</span>
      </label>
    </div>
    <div class="space-x-2">
      <input
        id="asDays"
        type="radio"
        checked={props.settings.displayDurationInDays}
        onClick={props.setDisplayDurationInDays.bind(null, true)}
      />
      <label for="asDays">Display as 81 days</label>
    </div>
    <div class="space-x-2">
      <input
        id="asDuration"
        type="radio"
        checked={!props.settings.displayDurationInDays}
        onClick={props.setDisplayDurationInDays.bind(null, false)}
      />
      <label for="asDuration">Display as 2 months 20 days</label>
    </div>
  </div>
);
