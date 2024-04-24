import { Tooltip } from "@ark-ui/solid";
import { For } from "solid-js";
import { Portal } from "solid-js/web";
import { Icon } from "common/Icon";

export const OverlapTooltip = (props: {
  trips: { name?: string; dates: string }[];
}) => (
  <Tooltip.Root closeDelay={100} openDelay={100}>
    <Tooltip.Trigger class="flex">
      <Icon name="warning" class="text-red-500" />
    </Tooltip.Trigger>
    <Portal>
      <Tooltip.Positioner>
        <Tooltip.Content class="z-10 rounded bg-gray-600 p-4 text-white">
          <For each={props.trips}>
            {(trip) => <p>overlaps with {trip.name || trip.dates}</p>}
          </For>
        </Tooltip.Content>
      </Tooltip.Positioner>
    </Portal>
  </Tooltip.Root>
);
