import { Component } from "solid-js";
import { Popover } from "@ark-ui/solid";
import { Input } from "common/Input.tsx";
import { Button } from "common/Button.tsx";

export const AddDate: Component = () => {
  const addDate = (e: SubmitEvent) => {
    e.preventDefault();
    console.debug(e);
  };

  return (
    <Popover.Root>
      <Popover.Trigger class="w-full">Pick new date</Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content class="min-w-64 rounded bg-stone-600 p-4">
          <Popover.Title>Pick a date</Popover.Title>
          <form onSubmit={addDate}>
            <Popover.Description class="space-y-2 py-2">
              <div class="grid grid-cols-3">
                <Input
                  outerClass="col-span-2"
                  name="name"
                  type="text"
                  label="Name"
                />
              </div>
              <div class="grid grid-cols-3">
                <Input
                  outerClass="col-span-2"
                  name="date"
                  type="date"
                  label="Date"
                />
              </div>
              <Button type="submit">Add</Button>
            </Popover.Description>
          </form>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  );
};
